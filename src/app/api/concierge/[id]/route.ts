import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
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

        return NextResponse.json({
            id: concierge._id.toString(),
            name: concierge.businessName,
            location: concierge.location,
            services: concierge.services,
            description: concierge.description,
            email: concierge.email,
            phone: concierge.phone
        })
    } catch (error) {
        console.error('Error fetching concierge:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}