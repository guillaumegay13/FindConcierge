import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const client = await clientPromise
        const db = client.db("conciergeRepository")

        // Store concierge data directly in the main collection
        const result = await db.collection("concierges").insertOne(body)

        return NextResponse.json({ message: 'Concierge registered successfully', id: result.insertedId }, { status: 200 })
    } catch (error) {
        console.error('Concierge registration error:', error)
        return NextResponse.json({ message: 'Concierge registration failed', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}