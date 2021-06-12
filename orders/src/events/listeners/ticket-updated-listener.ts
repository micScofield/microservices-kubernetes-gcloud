// we are listening this event because we need to update ticket data inside local tickets collection. Thus avoiding synchronous communication with other service for asking updated ticket data.

import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdatedEvent, NotFoundError } from '@jainsanyam/common'

import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        // find ticket inside tickets collection and update
        const { id, title, price } = data
        const ticket = Ticket.findByIdAndUpdate(id, { $set: { title, price } })

        if (!ticket) {
            throw new NotFoundError()
        }

        msg.ack()
    }
}
