'use client'

import { useState, useEffect } from 'react'
import { getDictionary } from '../../dictionaries'
import { Dictionary } from '../../dictionaries'
import Link from 'next/link'

interface Concierge {
    _id: string;
    businessName: string;
    location: { en: string; fr: string }[];
    services: { en: string; fr: string }[];
}

export default function Search({ params: { lang } }: { params: { lang: 'en' | 'fr' } }) {
    const [dict, setDict] = useState<Dictionary>({} as Dictionary)
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<Concierge[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getDictionary(lang).then(setDict)
    }, [lang])

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
                if (!response.ok) {
                    throw new Error('Search failed')
                }
                const data = await response.json()
                setResults(data)
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            }
            setIsLoading(false)
        }

        if (searchQuery) {
            fetchResults()
        } else {
            setResults([])
        }
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{dict.searchTitle}</h1>
                <div className="w-20 h-1 bg-black mb-8"></div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={dict.searchPlaceholder}
                    className="w-full p-4 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                {isLoading && <p className="text-gray-700 text-lg">{dict.loading}</p>}
                {!isLoading && results.length === 0 && searchQuery && (
                    <p className="text-gray-700 text-lg">{dict.noResults}</p>
                )}
                <div className="space-y-6">
                    {results.map((concierge: Concierge) => (
                        <div key={concierge._id} className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition duration-300">
                            <h2 className="text-2xl font-bold mb-2">
                                <Link href={`/${lang}/concierge/${concierge._id}`} className="text-black hover:underline">
                                    {concierge.businessName}
                                </Link>
                            </h2>
                            <p className="text-gray-700 mb-1">
                                <span className="font-medium">{dict.location}:</span> {concierge.location?.map(loc => loc[lang as 'en' | 'fr'])?.join(', ') || dict.notAvailable}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">{dict.services}:</span> {concierge.services?.map(service => dict[service.en as keyof Dictionary] || service.en)?.join(', ') || dict.notAvailable}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}