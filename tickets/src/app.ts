import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { NotFoundError, errorHandler } from '@jainsanyam/common'


const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(cookieSession({
    signed: false, //no encryption on cookie
    secure: process.env.NODE_ENV !== 'test' //send over https connection only
}))

// Ticket Routes
app.get('/api/tickets', (req, res) => res.send('From tickets service'))


// 404
app.all('*', async (req, res, next) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }