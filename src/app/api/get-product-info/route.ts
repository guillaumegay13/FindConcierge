// src/app/api/get-product-info/route.ts
import { NextResponse } from 'next/server';
import stripe from '../../lib/stripe';

export async function GET() {
    try {
        const product = await stripe.products.retrieve(process.env.STRIPE_PRODUCT_ID!);
        const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID!);

        return NextResponse.json({
            product: {
                name: product.name,
                description: product.description,
            },
            price: {
                unit_amount: price.unit_amount,
                currency: price.currency,
            }
        });
    } catch (error) {
        console.error('Error fetching product info:', error);
        return NextResponse.json({ error: 'Error fetching product info' }, { status: 500 });
    }
}