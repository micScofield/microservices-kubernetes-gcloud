import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { NotFoundError } from './errors/not-found-error'
import { errorHandler } from './middlewares/error-handler'
import mongoose from 'mongoose'

const app = express()

app.use(json())

// User Routes
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

// 404
app.all('*', async (req, res, next) => {
    throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
    try {
        await mongoose.connect(
            'mongodb://auth-mongo-srv:27017/auth', 
            { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
        )
        console.log('db connected')
    } catch (err) {
        console.log(err)
    }
    app.listen(3000, () => console.log('Listening on port 3000'))
}
start()