import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY env variable missing')
    }
    
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI env variable missing')
    }

    try {
        await natsWrapper.connect('ticketing', 'client_id', 'http://nats-srv:4222') 
        //cluster id is the one which we gave inside nats-depl file

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit()
        })

        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(
            process.env.MONGO_URI, 
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
        )
        
        console.log('db connected')
    } catch (err) {
        console.log(err)
    }
    app.listen(3000, () => console.log('Listening on port 3000'))
}
start()