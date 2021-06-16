import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
} from '@jainsanyam/common'

import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { stripe } from '../stripe'

const router = express.Router()

router.post(
    '/api/payments',
    requireAuth,
    [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
    validateRequest,
    async (req: Request, res: Response) => {

        const { token, orderId } = req.body

        const order = await Order.findById(orderId)

        if (!order) {
            throw new NotFoundError()
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order')
        }

        // make use of stripe
        let charge
        try {
            charge = await stripe.charges.create({
                currency: 'usd',
                amount: order.price * 100, // amount needs to be in cents
                source: token, // from req.body
                description: 'Testing purposes',
                shipping: {
                    name: 'Jenny Rosen',
                    address: {
                        line1: '510 Townsend St',
                        postal_code: '000000',
                        city: 'San Francisco',
                        state: 'CA',
                        country: 'US',
                    },
                },
            })
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }

        console.log('charge-details: ', charge)

        // store this payment inside payments collection (tying orderId and stripeId together there so that user can refer to past orders if required)
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        })

        await payment.save()

        res.status(201).send({ success: true })
    }
)

export { router as createChargeRouter }
