'use client'

import { useEffect, useState } from 'react'
import { getDictionary, Dictionary } from '../dictionaries'

export default function VisitorStats({ lang }: { lang: string }) {
    const [stats, setStats] = useState<{ today: number; pastWeek: number; live: number } | null>(null)
    const [dict, setDict] = useState<Dictionary>({} as Dictionary)

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, dictionary] = await Promise.all([
                    fetch('/api/stats'),
                    getDictionary(lang)
                ])
                if (!statsRes.ok) throw new Error('Failed to fetch stats')
                const statsData = await statsRes.json()
                setStats(statsData)
                setDict(dictionary)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [lang])

    if (!stats || !dict.visitorsToday) return null

    return (
        <div className="mt-4">
            <p>{dict.visitorsToday}: {stats.today}</p>
            <p>{dict.visitorsPastWeek}: {stats.pastWeek}</p>
            <p>{dict.liveVisitors}: {stats.live}</p>
        </div>
    )
}