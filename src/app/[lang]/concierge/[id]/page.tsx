'use client'

import { useState, useEffect } from 'react'
import { getDictionary } from '../../../dictionaries'
import { Dictionary } from '../../../dictionaries'

interface Concierge {
    businessName: string;
    location: string;
    services: string;
    description: string;
    email: string;
    phone: string;
    website?: string;
}

export default function ConciergePage({ params: { lang, id } }: { params: { lang: string, id: string } }) {
    const [dict, setDict] = useState<Dictionary>({} as Dictionary)
    const [concierge, setConcierge] = useState<Concierge | null>(null)
    const [showContact, setShowContact] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const dictionary = await getDictionary(lang)
            setDict(dictionary)

            const response = await fetch(`/api/concierge/${id}`)
            if (response.ok) {
                const conciergeData = await response.json()
                setConcierge(conciergeData)
            } else {
                console.error('Failed to fetch concierge data')
            }
        }
        fetchData()
    }, [lang, id])

    if (!concierge) return <div>{dict.loading}</div>

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{concierge.businessName}</h1>
            <p><strong>{dict.location}:</strong> {concierge.location}</p>
            <p><strong>{dict.services}:</strong> {concierge.services}</p>
            <p className="mt-4">{concierge.description}</p>

            <button
                onClick={() => setShowContact(!showContact)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {showContact ? dict.hideContact : dict.viewContact}
            </button>

            {showContact && (
                <div className="mt-4 p-4 bg-gray-800 rounded">
                    <h2 className="text-xl font-bold mb-2 text-white">{dict.contactInfo}</h2>
                    <p className="text-gray-300"><strong className="text-white">{dict.email}:</strong> {concierge.email}</p>
                    <p className="text-gray-300"><strong className="text-white">{dict.phone}:</strong> {concierge.phone}</p>
                    {concierge.website && (
                        <p className="text-gray-300">
                            <strong className="text-white">{dict.websitePlaceholder}:</strong>
                            <a href={concierge.website} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 ml-1">
                                {concierge.website}
                            </a>
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}