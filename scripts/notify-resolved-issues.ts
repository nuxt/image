import process from 'node:process'
import { execFileSync } from 'node:child_process'

const REPO = process.env.GITHUB_REPOSITORY || 'nuxt/image'
const [OWNER, NAME] = REPO.split('/') as [string, string]
const TOKEN = process.env.GITHUB_TOKEN
const DRY_RUN = process.env.DRY_RUN === 'true'

const NOTIFY_ONCE = process.env.NOTIFY_ONCE !== 'false'
const MARKER_PREFIX = '<!-- released-in:'

interface Issue {
  number: number
  state: string
  locked: boolean
  url: string
  repository: { nameWithOwner: string }
  prs: Set<number>
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function git(...args: string[]) {
  return execFileSync('git', args, { encoding: 'utf-8' }).trim()
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'authorization': `bearer ${TOKEN}`,
      'content-type': 'application/json',
      ...init?.headers,
    },
  })
  const data = await res.json().catch(() => ({})) as T & { message?: string }
  if (!res.ok) {
    throw Object.assign(new Error(data.message || `${res.status} ${res.statusText}`), { status: res.status })
  }
  return data
}

async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await api<{ data: T, errors?: { message: string }[] }>('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  })
  if (res.errors?.length) {
    throw new Error(res.errors.map(e => e.message).join('\n'))
  }
  return res.data
}

/**
 * The tag of the release we are notifying about, and the previous tag in its
 * own release line.
 */
function resolveTagRange() {
  const tag = process.env.TAG || process.env.GITHUB_REF_NAME
  const major = tag?.match(/^v(\d+)\./)?.[1]
  if (!tag || !major) {
    throw new Error(`Expected a release tag such as \`v2.0.0\`, received \`${tag}\`.`)
  }
  const previousTag = git('describe', '--tags', '--abbrev=0', '--match', `v${major}.*`, `refs/tags/${tag}^`)
  return { tag, previousTag }
}

function getPullRequestNumbers(from: string, to: string) {
  const log = git('log', '--format=%s%n%b', `refs/tags/${from}..refs/tags/${to}`)
  const numbers = new Set<number>()
  for (const match of log.matchAll(/\(#(\d+)\)/g)) {
    numbers.add(Number(match[1]))
  }
  return [...numbers].sort((a, b) => a - b)
}

async function getClosedIssues(prNumbers: number[]) {
  const issues = new Map<number, Issue>()

  for (const prNumber of prNumbers) {
    const data = await graphql<{
      repository: {
        pullRequest: null | {
          merged: boolean
          closingIssuesReferences: { nodes: Omit<Issue, 'prs'>[] }
        }
      }
    }>(`
      query ($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          pullRequest(number: $number) {
            merged
            closingIssuesReferences(first: 50) {
              nodes { number state locked url repository { nameWithOwner } }
            }
          }
        }
      }
    `, { owner: OWNER, name: NAME, number: prNumber })

    const pr = data.repository.pullRequest
    if (!pr?.merged) {
      continue
    }

    for (const issue of pr.closingIssuesReferences.nodes) {
      // A PR can close issues in other repositories, which we have neither the
      // permission nor the intent to comment on.
      if (issue.repository.nameWithOwner !== REPO) {
        continue
      }

      const existing = issues.get(issue.number)
      if (existing) {
        existing.prs.add(prNumber)
        continue
      }
      issues.set(issue.number, { ...issue, prs: new Set([prNumber]) })
    }
  }

  return [...issues.values()]
}

async function hasExistingComment(issueNumber: number, marker: string) {
  const comments = await api<{ body: string }[]>(`https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments?per_page=100`)
  return comments.some(comment => comment.body?.includes(marker))
}

function hasCommented(issueNumber: number, tag: string) {
  return hasExistingComment(issueNumber, NOTIFY_ONCE ? MARKER_PREFIX : `${MARKER_PREFIX}${tag} -->`)
}

async function main() {
  if (!TOKEN) {
    throw new Error('`GITHUB_TOKEN` is required.')
  }

  const { tag, previousTag } = resolveTagRange()
  console.info(`Comparing ${previousTag}...${tag}`)

  const prNumbers = getPullRequestNumbers(previousTag, tag)
  console.info(`Found ${prNumbers.length} pull request(s) in the release.`)

  const issues = await getClosedIssues(prNumbers)
  console.info(`Found ${issues.length} linked issue(s).`)

  const marker = `${MARKER_PREFIX}${tag} -->`

  for (const issue of issues) {
    const prs = [...issue.prs].map(n => `#${n}`).join(', ')
    const body = [
      marker,
      `This issue was resolved by ${prs}, which was released in [${tag}](https://github.com/${REPO}/releases/tag/${tag}).`,
      '',
      'If you are still seeing this problem after upgrading, please let us know (ideally with an updated reproduction) and we will take another look.',
    ].join('\n')

    if (issue.locked) {
      console.log(`Skipping #${issue.number} - issue is locked.`)
      continue
    }

    if (DRY_RUN) {
      console.log(`[dry run] would comment on #${issue.number} (resolved by ${prs})`)
      continue
    }

    if (await hasCommented(issue.number, tag)) {
      console.log(`Skipping #${issue.number} - already notified.`)
      continue
    }

    try {
      await comment(issue.number, body)
      console.log(`Commented on #${issue.number} (resolved by ${prs}).`)
    }
    catch (error) {
      // One inaccessible issue (locked while we ran, transferred, deleted) should
      // not stop the rest of the release from being notified.
      console.warn(`Could not comment on #${issue.number}:`, (error as Error).message)
    }

    // GitHub asks for at least a second between write requests to avoid
    // tripping the secondary rate limit.
    await delay(1000)
  }
}

async function comment(issueNumber: number, body: string, attempt = 1): Promise<void> {
  try {
    await api(`https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    })
  }
  catch (error) {
    const { status, message } = error as { status?: number, message?: string }
    const isRateLimited = status === 403 && /rate limit|abuse/i.test(message || '')
    if (isRateLimited && attempt <= 5) {
      const backoff = 30_000 * attempt
      console.warn(`Rate limited, retrying #${issueNumber} in ${backoff / 1000}s.`)
      await delay(backoff)
      return comment(issueNumber, body, attempt + 1)
    }
    throw error
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
