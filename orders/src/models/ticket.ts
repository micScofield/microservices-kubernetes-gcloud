import mongoose from 'mongoose'
// import { OrderStatus } from '@jainsanyam/common'

import { Order, OrderStatus } from './order'

interface TicketAttrs {
  title: string
  price: number
}

interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

//defined just to use ts features like when creating a ticket, we get hints on what it requires
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

/*
defining an isReserved method which we can use on order routes to check ticket status. If not using this feature, we would have to write out this logic in each route handler where we require the ticket status
Using function() {} because we need to access "this". 
"this" will refer to document which we will call .isReserved() on
*/
ticketSchema.methods.isReserved = async function() {
  const existingOrder = await Order.findOne({
    status: {
      $in: [ OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete ]
    }
  })

  console.log(existingOrder)
  if (existingOrder) return true

  return false
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema) //<document-type, model-type>

export { Ticket, TicketDoc }

/*
statics allows us to add method on model
methods allows us to add method on document
*/