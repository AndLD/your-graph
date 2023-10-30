const jobs: NodeJS.Timer[] = []

async function addJob(job: () => void, h: number) {
    job()
    jobs.push(setInterval(job, h * 60 * 60 * 1000))
}

function stop() {
    jobs.forEach(clearInterval)
}

export const cronService = {
    addJob,
    stop
}
