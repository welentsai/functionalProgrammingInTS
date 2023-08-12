type Job = {
    name: string
    start: () => void
    state: "incomplete" | "success" | "failure"
}

type JobRun<J extends Job> = {
    job: J
    state: "queued" | "running" | "completeed"
    onComplete: (cb: (job: J) => void ) => void
}

type SendEmailJob = Job & {
    recipientEmail: string
    subject: string
}

function enqueueJob<T extends Job>(job: T) : JobRun<T> {
    // queue logic here
    job.start()
    return {
        job,
        state: "queued",
        onComplete: (cb: (job: T) => void) => cb(job)
    }
}

const j: SendEmailJob = {
    recipientEmail: "welentsai@gmail.com",
    subject: "hi there",
    name: "send-email",
    start: () => null,
    state: "incomplete"
}

const run = enqueueJob(j)

run.onComplete((job) => {
    console.log(job)
})
