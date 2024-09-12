import { NextResponse } from 'next/server';
import stripe from '../../lib/stripe';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
    try {
        const { conciergeId } = await request.json();

        // Récupérer les détails du prix
        const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID!);

        if (!price.unit_amount) {
            throw new Error('Price amount is not set');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price.unit_amount,
            currency: price.currency,
            automatic_payment_methods: { enabled: true },
            metadata: { conciergeId },
        });

        const client = await clientPromise;
        const db = client.db("conciergeRepository");
        await db.collection("concierges").updateOne(
            { _id: new ObjectId(conciergeId) },
            { $set: { paymentIntentId: paymentIntent.id } }
        );

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        return NextResponse.json({ error: 'Error creating PaymentIntent' }, { status: 500 });
    }
}