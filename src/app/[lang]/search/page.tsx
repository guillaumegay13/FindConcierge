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
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{dict.searchTitle}</h1>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className="w-full p-2 border rounded mb-4"
            />
            {isLoading && <p>{dict.loading}</p>}
            {!isLoading && results.length === 0 && searchQuery && <p>{dict.noResults}</p>}
            <div>
                {results.map((concierge: Concierge) => (
                    <div key={concierge._id} className="border p-4 mb-2 rounded">
                        <h2 className="font-bold">
                            <Link href={`/${lang}/concierge/${concierge._id}`} className="text-blue-500 hover:underline">
                                {concierge.businessName}
                            </Link>
                        </h2>
                        <p>{dict.location}: {concierge.location?.map(loc => loc[lang as 'en' | 'fr'])?.join(', ') || dict.notAvailable}</p>
                        <p>{dict.services}: {concierge.services?.map(service => dict[service.en as keyof Dictionary] || service.en)?.join(', ') || dict.notAvailable}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}