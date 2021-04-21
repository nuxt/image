export async function nextTick() {
    await new Promise(resolve =>
        process.nextTick(() =>
            resolve(null)
        )
    )
}
