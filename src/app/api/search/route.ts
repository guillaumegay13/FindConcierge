import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'

type FilterCondition = {
    businessName?: RegExp;
    'location.en'?: RegExp;
    'location.fr'?: RegExp;
    'services.en'?: RegExp;
    'services.fr'?: RegExp;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    try {
        const client = await clientPromise
        const db = client.db("conciergeRepository")
        const concierges = db.collection("concierges")

        const filter: { paymentStatus: string; $or?: FilterCondition[] } = {
            paymentStatus: 'active'
        }

        if (query) {
            const regexQuery = new RegExp(query, 'i')
            filter.$or = [
                { businessName: regexQuery },
                { 'location.en': regexQuery },
                { 'location.fr': regexQuery },
                { 'services.en': regexQuery },
                { 'services.fr': regexQuery }
            ]
        }

        const results = await concierges.find(filter).toArray()
        return NextResponse.json(results)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ message: 'Search failed', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}