import { NextResponse } from 'next/server';
import stripe from '../../lib/stripe';
import clientPromise from '../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("conciergeRepository");
        const conciergesCount = await db.collection("concierges").countDocuments({ paymentStatus: 'active' });

        const priceTiers = [
            { id: process.env.STRIPE_PRICE_ID_1!, maxCustomers: 100 },
            { id: process.env.STRIPE_PRICE_ID_2!, maxCustomers: 100 },
            { id: process.env.STRIPE_PRICE_ID_3!, maxCustomers: 100 },
            { id: process.env.STRIPE_PRICE_ID_4!, maxCustomers: 100 },
            { id: process.env.STRIPE_PRICE_ID_5!, maxCustomers: 100 },
            { id: process.env.STRIPE_PRICE_ID_6!, maxCustomers: 500 },
            { id: process.env.STRIPE_PRICE_ID_7!, maxCustomers: 1000 },
            { id: process.env.STRIPE_PRICE_ID_8!, maxCustomers: 1000 },
        ];

        let currentPrice, nextPrice;
        for (let i = 0; i < priceTiers.length; i++) {
            if (conciergesCount < priceTiers[i].maxCustomers) {
                currentPrice = await stripe.prices.retrieve(priceTiers[i].id);
                nextPrice = i + 1 < priceTiers.length ? await stripe.prices.retrieve(priceTiers[i + 1].id) : null;
                break;
            }
        }

        if (!currentPrice) {
            currentPrice = await stripe.prices.retrieve(priceTiers[priceTiers.length - 1].id);
        }

        const remainingAtCurrentPrice = currentPrice ?
            (priceTiers.find(tier => tier.id === currentPrice.id)?.maxCustomers || 0) - conciergesCount :
            0;

        return NextResponse.json({
            currentPrice: currentPrice ? {
                id: currentPrice.id,
                amount: currentPrice.unit_amount,
                currency: currentPrice.currency,
                remaining: remainingAtCurrentPrice
            } : null,
            nextPrice: nextPrice ? {
                id: nextPrice.id,
                amount: nextPrice.unit_amount,
                currency: nextPrice.currency
            } : null
        });
    } catch (error) {
        console.error('Error fetching current price:', error);
        return NextResponse.json({ error: 'Error fetching current price' }, { status: 500 });
    }
}