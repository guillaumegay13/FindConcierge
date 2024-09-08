import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    try {
        const client = await clientPromise
        const db = client.db("conciergeRepository")
        const concierges = db.collection("concierges")

        let filter = {}
        if (query) {
            filter = {
                $or: [
                    { businessName: { $regex: query, $options: 'i' } },
                    { location: { $regex: query, $options: 'i' } },
                    { services: { $regex: query, $options: 'i' } }
                ]
            }
        }

        const results = await concierges.find(filter).toArray()
        return NextResponse.json(results)
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ message: 'Search failed', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}