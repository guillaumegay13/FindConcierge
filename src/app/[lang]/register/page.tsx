'use client'

import { useState, useEffect } from 'react'
import { getDictionary } from '../../dictionaries'

export default function Register({ params: { lang } }: { params: { lang: string } }) {
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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')

    useEffect(() => {
        getDictionary(lang).then(setDict)
    }, [lang])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setSubmitMessage('')

        try {
            console.log('Sending request to:', '/api/register');
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const data = await response.json()
            console.log('Response data:', data);

            setSubmitMessage(dict.registrationSuccess);
            setFormData({ businessName: '', email: '', phone: '', website: '', services: '', location: '', description: '' })
        } catch (error) {
            console.error('Detailed error:', error);
            if (error instanceof Error) {
                setSubmitMessage(`${dict.registrationError}: ${error.message}`);
            } else {
                setSubmitMessage(`${dict.registrationError}: ${dict.genericError}`);
            }
        }
        setIsSubmitting(false);
    }

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{dict.registerTitle}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder={dict.businessNamePlaceholder} className="w-full p-2 border rounded" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={dict.emailPlaceholder} className="w-full p-2 border rounded" required />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={dict.phonePlaceholder} className="w-full p-2 border rounded" required />
                <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder={dict.websitePlaceholder} className="w-full p-2 border rounded" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder={dict.locationPlaceholder} className="w-full p-2 border rounded" required />
                <textarea name="services" value={formData.services} onChange={handleChange} placeholder={dict.servicesPlaceholder} className="w-full p-2 border rounded" rows={4} required></textarea>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder={dict.descriptionPlaceholder} className="w-full p-2 border rounded" rows={4} required></textarea>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
                    {isSubmitting ? dict.loading : dict.registerButton}
                </button>
            </form>
            {submitMessage && <p className="mt-4">{submitMessage}</p>}
        </div>
    )
}