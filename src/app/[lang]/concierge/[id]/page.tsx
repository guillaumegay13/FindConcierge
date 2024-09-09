import { getDictionary } from '../../../dictionaries'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

const getConcierge = async (id: string) => {
    try {
        const client = await clientPromise
        const db = client.db("conciergeRepository")
        const concierge = await db.collection("concierges").findOne({ _id: new ObjectId(id) })

        if (!concierge) {
            throw new Error('Concierge not found')
        }

        return {
            id: concierge._id.toString(),
            name: concierge.businessName,
            location: concierge.location,
            services: concierge.services,
            description: concierge.description
        }
    } catch (error) {
        console.error('Error fetching concierge:', error)
        throw error
    }
}

export default async function ConciergePage({ params: { lang, id } }: { params: { lang: string, id: string } }) {
    const dict = await getDictionary(lang)
    const concierge = await getConcierge(id)

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{concierge.name}</h1>
            <p><strong>{dict.location}:</strong> {concierge.location}</p>
            <p><strong>{dict.services}:</strong> {concierge.services.join(', ')}</p>
            <p className="mt-4">{concierge.description}</p>
        </div>
    )
}