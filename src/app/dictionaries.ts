import { cache } from 'react'

export type Dictionary = {
    title: string
    description: string
    searchButton: string
    registerButton: string
    searchTitle: string
    searchPlaceholder: string
    registerTitle: string
    businessNamePlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    servicesPlaceholder: string
    home: string
    location: string
    services: string
    conciergeProfileTitle: string
    saveProfile: string
    profile: string
    registerConcierge: string
    viewContact: string
    registerConciergeTitle: string
    registerConciergeDescription: string
    registrationSuccess: string
    registrationError: string
    genericError: string
    networkError: string
    invalidEmail: string
    methodNotAllowed: string
    websitePlaceholder: string
    locationPlaceholder: string
    descriptionPlaceholder: string
    loading: string
    noResults: string
}

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default) as Promise<Dictionary>,
    fr: () => import('./dictionaries/fr.json').then((module) => module.default) as Promise<Dictionary>,
}

export const getDictionary = cache(async (locale: string) => dictionaries[locale as 'en' | 'fr']())