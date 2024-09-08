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
}

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default) as Promise<Dictionary>,
    fr: () => import('./dictionaries/fr.json').then((module) => module.default) as Promise<Dictionary>,
}

export const getDictionary = cache(async (locale: string) => dictionaries[locale as 'en' | 'fr']())