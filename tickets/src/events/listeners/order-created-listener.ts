import { Listener, OrderCreatedEvent, Subjects, NotFoundError } from '@jainsanyam/common'
import { Message } from 'node-nats-streaming'

import { queueGroupName } from './queueGroupName'
import { Ticket } from '../../models/ticket'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        /* Steps: specify what to do upon receiving an order created event
        1. take ticket id from data, fetch the ticket using that id
        2. set orderid field inside ticket which indicates ticket is reserved
        3. Send acknowledgement
        */

        const ticketId = data.ticket.id
        const orderId = data.id

        const ticket = await Ticket.findById(ticketId)

        if (!ticket) {
            throw new NotFoundError()
        }

        // await Ticket.updateOne({ _id: ticketId }, { $set: { orderId } })
        ticket.set({ orderId })
        await ticket.save()

        msg.ack()
    }

}