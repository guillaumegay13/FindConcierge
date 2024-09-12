import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import stripe from '../../../../lib/stripe'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise
        const db = client.db("conciergeRepository")
        const concierge = await db.collection("concierges").findOne({ _id: new ObjectId(params.id) })

        if (!concierge) {
            return NextResponse.json({ error: 'Concierge not found' }, { status: 404 })
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(concierge.paymentIntentId)

        if (paymentIntent.status === 'succeeded') {
            await db.collection("concierges").updateOne(
                { _id: new ObjectId(params.id) },
                { $set: { paymentStatus: 'paid' } }
            )
            return NextResponse.json({ message: 'Payment confirmed successfully' })
        } else {
            return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
        }
    } catch (error) {
        console.error('Error confirming payment:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}