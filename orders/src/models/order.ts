import mongoose from 'mongoose'
import { OrderStatus } from '@jainsanyam/common'

import { TicketDoc } from './ticket'

interface OrderAttrs {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus), // In JS, we dont have enums, so we can pass a freezed object as an argument
            default: OrderStatus.Created, //not required though
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
            }
        }
    }
)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order, OrderStatus }
