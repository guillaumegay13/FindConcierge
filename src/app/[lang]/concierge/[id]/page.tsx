'use client'

import { useState, useEffect } from 'react'
import { getDictionary } from '../../../dictionaries'
import { Dictionary } from '../../../dictionaries'
import Head from 'next/head'

interface MultilingualItem {
    en: string;
    fr: string;
}

interface Concierge {
    name: string;
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
        <div className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <Head>
                <title>{concierge.name}</title>
            </Head>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{concierge.name}</h1>
                <div className="w-20 h-1 bg-black mb-8"></div>
                <p className="text-xl text-gray-700 mb-4">
                    <strong>{getText('location')}:</strong> {concierge.location.map(loc => getLocalizedText(loc)).join(', ')}
                </p>
                <p className="text-xl text-gray-700 mb-4">
                    <strong>{getText('services')}:</strong> {concierge.services.map(service => getLocalizedText(service)).join(', ')}
                </p>
                <p className="text-xl text-gray-700 mb-12 leading-relaxed">{concierge.description}</p>

                <button
                    onClick={() => setShowContact(!showContact)}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                    {showContact ? getText('hideContact') : getText('viewContact')}
                </button>

                {showContact && (
                    <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">{getText('contactInfo')}</h2>
                        <p className="text-gray-700 mb-2">
                            <strong className="text-gray-900">{getText('email')}:</strong> {concierge.email}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong className="text-gray-900">{getText('phone')}:</strong> {concierge.phone}
                        </p>
                        {concierge.website && (
                            <p className="text-gray-700">
                                <strong className="text-gray-900">{getText('websitePlaceholder')}:</strong>
                                <a href={concierge.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 ml-1">
                                    {concierge.website}
                                </a>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}