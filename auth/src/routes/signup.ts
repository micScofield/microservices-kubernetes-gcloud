import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { RequestValidationError } from '../errors/request-validation-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'
import { BadRequestError } from '../errors/bad-request-error'
import { User } from '../models/user'

const router = express.Router()

router.post(
    '/api/users/signup',
    [
        body('email').isEmail().withMessage('Invalid Email !'),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array())
        }

        const { email, password } = req.body

        const existingUser = await User.findOne({ email }, { _id: 0, email: 1 })
        if (existingUser) {
            throw new BadRequestError('Email address is already in use. Please try signing in or sign up with a new email !')
        }

        // save user
        const user = await User.build({ email, password }).save()
        console.log(user)
        // generate token
        const userToken = jwt.sign(
            { id: user._id, email: user.email },
            'secret-key'
        )

        // attach token to session object
        req.session = { jwt: userToken }
        return res.status(201).send({ user: user.email })
    }
)

export { router as signupRouter }