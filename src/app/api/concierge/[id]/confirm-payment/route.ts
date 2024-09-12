import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import stripe from '../../../../lib/stripe'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const concierge = await getConciergeById(id);
        if (!concierge || !concierge.paymentIntentId) {
            console.error(`Invalid concierge ID or missing payment intent for ID: ${id}`);
            return NextResponse.json(
                { success: false, error: 'Invalid concierge ID or missing payment intent' },
                { status: 400 }
            );
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(concierge.paymentIntentId);

        switch (paymentIntent.status) {
            case 'succeeded':
                await updateConciergePaymentStatus(id, 'paid');
                return NextResponse.json({ success: true });
            case 'requires_payment_method':
                return NextResponse.json(
                    { success: false, error: 'Payment requires a payment method. Please try again.' },
                    { status: 400 }
                );
            case 'requires_confirmation':
                // You might want to confirm the payment here
                const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
                if (confirmedIntent.status === 'succeeded') {
                    await updateConciergePaymentStatus(id, 'paid');
                    return NextResponse.json({ success: true });
                } else {
                    return NextResponse.json(
                        { success: false, error: `Payment confirmation failed: ${confirmedIntent.status}` },
                        { status: 400 }
                    );
                }
            default:
                return NextResponse.json(
                    { success: false, error: `Unexpected payment status: ${paymentIntent.status}` },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}

async function getConciergeById(id: string) {
    const client = await clientPromise;
    const db = client.db("conciergeRepository");
    return await db.collection("concierges").findOne({ _id: new ObjectId(id) });
}

async function updateConciergePaymentStatus(id: string, status: string) {
    const client = await clientPromise;
    const db = client.db("conciergeRepository");
    await db.collection("concierges").updateOne({ _id: new ObjectId(id) }, { $set: { paymentStatus: status } });
}