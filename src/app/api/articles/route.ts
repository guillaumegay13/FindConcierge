import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("conciergeRepository");
        const articles = await db.collection("articles").find({}).toArray();
        return NextResponse.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}