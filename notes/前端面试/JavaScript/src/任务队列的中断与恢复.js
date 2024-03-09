function processTasks(...tasks) {
    let isRunning = false
    const result = []
    let i = 0
    return {
        start() {
            return new Promise(async (resolve) => {
                if (isRunning) {
                    return
                }
                isRunning = true
                while (i < tasks.length) {
                    const r = await tasks[i]()
                    result.push(r)
                    i++
                    if (!isRunning) {
                        return
                    }
                }
                isRunning = false
                resolve(result)
            })
        },
        pause() {
            isRunning = false
        }
    }
}