import mongoose from 'mongoose'

import { app } from './app'

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY env variable missing')
    }
    
    try {
        await mongoose.connect(
            'mongodb://tickets-mongo-srv:27017/auth', 
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
        )
        console.log('db connected')
    } catch (err) {
        console.log(err)
    }
    app.listen(3000, () => console.log('Listening on port 3000'))
}
start()