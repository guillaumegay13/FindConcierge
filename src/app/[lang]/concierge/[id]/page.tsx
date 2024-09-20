'use client'

import { useState, useEffect } from 'react'
import { getDictionary } from '../../../dictionaries'
import { Dictionary } from '../../../dictionaries'

interface MultilingualItem {
    en: string;
    fr: string;
}

interface Concierge {
    businessName: string;
    location: MultilingualItem[];
    services: MultilingualItem[];
    description: string;
    email: string;
    phone: string;
    website?: string;
}

export default function ConciergePage({ params: { lang, id } }: { params: { lang: string, id: string } }) {
    const [dict, setDict] = useState<Dictionary | null>(null)
    const [concierge, setConcierge] = useState<Concierge | null>(null)
    const [showContact, setShowContact] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dictionary = await getDictionary(lang)
                setDict(dictionary)

                const response = await fetch(`/api/concierge/${id}`)
                if (response.ok) {
                    const conciergeData = await response.json()
                    setConcierge(conciergeData)
                } else {
                    console.error('Failed to fetch concierge data')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [lang, id])

    if (!dict || !concierge) return <div>Loading...</div>

    const getText = (key: keyof Dictionary): string => {
        const value = dict[key]
        return typeof value === 'string' ? value : JSON.stringify(value)
    }

    const getLocalizedText = (item: MultilingualItem): string => {
        return item[lang as keyof MultilingualItem] || item.en || item.fr || ''
    }

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{concierge.businessName}</h1>
            <p><strong>{getText('location')}:</strong> {concierge.location.map(loc => getLocalizedText(loc)).join(', ')}</p>
            <p><strong>{getText('services')}:</strong> {concierge.services.map(service => getLocalizedText(service)).join(', ')}</p>
            <p className="mt-4">{concierge.description}</p>

            <button
                onClick={() => setShowContact(!showContact)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {showContact ? getText('hideContact') : getText('viewContact')}
            </button>

            {showContact && (
                <div className="mt-4 p-4 bg-gray-800 rounded">
                    <h2 className="text-xl font-bold mb-2 text-white">{getText('contactInfo')}</h2>
                    <p className="text-gray-300"><strong className="text-white">{getText('email')}:</strong> {concierge.email}</p>
                    <p className="text-gray-300"><strong className="text-white">{getText('phone')}:</strong> {concierge.phone}</p>
                    {concierge.website && (
                        <p className="text-gray-300">
                            <strong className="text-white">{getText('websitePlaceholder')}:</strong>
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