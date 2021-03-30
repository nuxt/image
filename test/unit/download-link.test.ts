import { NuxtDownloadLink } from '../../src/runtime'
import { testComponent } from '../fixture/utils/download-link'

describe('Renders simple download link', () => {
  testComponent(NuxtDownloadLink, {})
})
