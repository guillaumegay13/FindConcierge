import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db("conciergeRepository");

        const result = await db.collection("concierges").updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { paymentStatus: 'active' } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, error: 'Concierge not found' }, { status: 404 });
        }

        if (result.modifiedCount === 0) {
            return NextResponse.json({ success: false, error: 'Payment status not updated' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Payment confirmed and status updated' });
    } catch (error) {
        console.error('Error confirming payment:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}