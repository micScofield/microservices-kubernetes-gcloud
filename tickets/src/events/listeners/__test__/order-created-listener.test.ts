import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from '@jainsanyam/common'

import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
    // create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 29,
        userId: '123'
    })

    await ticket.save()

    // create a fake data event
    const data: OrderCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: '',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // create a fake message object
    // @ts-ignore 
    const msg: Message = {
        ack: jest.fn(),
    }

    return { listener, data, msg, ticket }
}

it('sets the orderId of a ticket', async () => {
    const { listener, ticket, data, msg } = await setup()

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure a ticket was created!
    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket).toBeDefined()
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
    const { data, listener, msg } = await setup()

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled()
})
