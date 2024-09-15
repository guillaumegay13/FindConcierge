'use client'

import { useState, useEffect } from 'react'
import { getDictionary } from '../../dictionaries'
import { Dictionary } from '../../dictionaries'
import { useRouter } from 'next/navigation'
import { SERVICES } from '../../../constants/services'
import { LOCATIONS } from '../../../constants/locations'
import { MultilingualService, MultilingualLocation, MULTILINGUAL_LOCATIONS } from '../../../constants/multilingualData'

export default function Register({ params: { lang } }: { params: { lang: string } }) {
    const [dict, setDict] = useState<Dictionary>({} as Dictionary)
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        phone: '',
        website: '',
        services: [] as MultilingualService[],
        location: [] as MultilingualLocation[],
        description: ''
    })
    const [locationSearch, setLocationSearch] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        getDictionary(lang)
            .then(setDict)
            .catch(error => {
                console.error('Error loading dictionary:', error);
            });
    }, [lang])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleServiceToggle = (service: MultilingualService) => {
        setFormData(prevData => ({
            ...prevData,
            services: prevData.services.includes(service)
                ? prevData.services.filter(s => s !== service)
                : [...prevData.services, service]
        }))
    }

    const handleLocationSelect = (location: MultilingualLocation) => {
        if (!formData.location.includes(location)) {
            setFormData(prevData => ({
                ...prevData,
                location: [...prevData.location, location]
            }))
        }
        setLocationSearch('')
    }

    const handleLocationRemove = (location: MultilingualLocation) => {
        setFormData(prevData => ({
            ...prevData,
            location: prevData.location.filter(l => l !== location)
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setSubmitMessage('')

        try {
            if (formData.location.length === 0) {
                throw new Error(dict.noLocationSelected || 'Please select at least one location');
            }

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),  // Send location as an array
            });

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            setSubmitMessage(dict.registrationSuccess)
            router.push(`/${lang}/payment/${data.id}`)
        } catch (error) {
            console.error('Registration error:', error);
            setSubmitMessage(`${dict.registrationError}: ${error instanceof Error ? error.message : dict.genericError}`);
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

                {/* Services field */}
                <div>
                    <p className="mb-2">{dict.servicesPlaceholder}</p>
                    <div className="flex flex-wrap gap-2">
                        {SERVICES.map(service => (
                            <button
                                key={service}
                                type="button"
                                onClick={() => handleServiceToggle(service)}
                                className={`px-3 py-1 rounded ${formData.services.includes(service)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                                {dict[service as keyof Dictionary]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Locations field */}
                <div>
                    <input
                        type="text"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder={dict.locationPlaceholder}
                        className="w-full p-2 border rounded mb-2"
                    />
                    {locationSearch && (
                        <ul className="border rounded mt-1 max-h-40 overflow-y-auto">
                            {LOCATIONS
                                .filter(location =>
                                    MULTILINGUAL_LOCATIONS[location][lang].toLowerCase().includes(locationSearch.toLowerCase())
                                )
                                .map(location => (
                                    <li
                                        key={location}
                                        onClick={() => handleLocationSelect(location)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {MULTILINGUAL_LOCATIONS[location][lang]}
                                    </li>
                                ))}
                        </ul>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.location.map(location => (
                            <span key={location} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                                {MULTILINGUAL_LOCATIONS[location][lang]}
                                <button
                                    onClick={() => handleLocationRemove(location)}
                                    className="ml-2 text-blue-800 hover:text-blue-600"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <textarea name="description" value={formData.description} onChange={handleChange} placeholder={dict.descriptionPlaceholder} className="w-full p-2 border rounded" rows={4} required></textarea>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
                    {isSubmitting ? dict.loading : dict.registerButton}
                </button>
            </form>
            {submitMessage && <p className="mt-4">{submitMessage}</p>}
        </div>
    )
}