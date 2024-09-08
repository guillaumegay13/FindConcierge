'use client'

import { useState, useEffect } from 'react'
import { getDictionary } from '../../../dictionaries'

export default function ConciergeRegister({ params: { lang } }: { params: { lang: string } }) {
    const [dict, setDict] = useState<any>({})
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        phone: '',
        website: '',
        services: '',
        location: '',
        description: ''
    })

    useEffect(() => {
        getDictionary(lang).then(setDict)
    }, [lang])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement API call to register concierge
        console.log(formData)
    }

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{dict.conciergeRegisterTitle}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder={dict.businessNamePlaceholder}
                    className="w-full p-2 border rounded"
                    required
                />
                {/* Add other form fields similarly */}
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    {dict.registerButton}
                </button>
            </form>
        </div>
    )
}