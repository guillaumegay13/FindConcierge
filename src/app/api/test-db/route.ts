import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db("conciergeRepository")

        // Perform a simple operation, like inserting a test document
        const testCollection = db.collection("test")
        await testCollection.insertOne({ test: "Hello MongoDB!", date: new Date() })

        // Fetch the document we just inserted
        const result = await testCollection.findOne({ test: "Hello MongoDB!" })

        return NextResponse.json({ message: 'Database connection successful', result }, { status: 200 })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}