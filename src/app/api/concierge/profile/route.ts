import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const client = await clientPromise
        const db = client.db("conciergeRepository")

        // TODO: Add validation and error handling
        const result = await db.collection("concierges").insertOne(body)

        return NextResponse.json({ message: 'Profile updated successfully', id: result.insertedId }, { status: 200 })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ message: 'Profile update failed', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}