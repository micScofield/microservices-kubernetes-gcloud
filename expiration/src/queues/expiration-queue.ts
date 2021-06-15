import Queue from 'bull'

// create an interface which defines whats required in a job in a queue
interface Payload {
    orderId: string
}

// create an instance of queue: expirationQueue
// first parameter is a bucket name in which all events of this category will be stored inside redis. Second is the redis host name which we set inside a env variable inside deployment file

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

// process incoming jobs to the queue
expirationQueue.process(async (job) => {

    // we need to publish expiration:complete event
})

export { expirationQueue }