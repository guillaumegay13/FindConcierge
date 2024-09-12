'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDictionary } from '../../../dictionaries'
import { Dictionary } from '../../../dictionaries'

export default function Success({ params: { lang } }: { params: { lang: string } }) {
    const [dict, setDict] = useState<Dictionary>({} as Dictionary)
    const router = useRouter()

    useEffect(() => {
        getDictionary(lang).then(setDict)
        const timer = setTimeout(() => router.push(`/${lang}`), 5000)
        return () => clearTimeout(timer)
    }, [lang, router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">{dict.paymentSuccessful}</h1>
                <p>{dict.redirectingHome}</p>
            </div>
        </div>
    )
}