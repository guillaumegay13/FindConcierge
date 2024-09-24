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
    hideContact: string
    contactInfo: string
    email: string
    phone: string
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
    conciergerieIn: string
    servicesForAirbnb: string
    findBestConciergeService: string
    forYourAirbnb: string
    discoverBestConciergeServices: string
    accountCreationPrompt: string
    createAccountButton: string
    accountCreationError: string
    passwordPlaceholder: string
    signIn: string
    signInWithGoogle: string
    proceedToPayment: string
    processing: string
    pay: string
    paymentError: string
    paymentSuccessful: string
    redirectingHome: string
    paymentTitle: string
    paymentDescription: string
    price: string
    leftAtCurrentPrice: string
    nextPrice: string
    online_listing_creation: string
    professional_photography: string
    price_optimization: string
    calendar_management: string
    guest_tracking: string
    linen_supply: string
    professional_cleaning: string
    maintenance_service: string
    check_in_out: string
    welcome_gifts: string
    assistance_24_7: string
    review_monitoring: string
    property_insurance: string
    consumables_tracking: string
    noLocationSelected: string
    notAvailable: string
    about: string
    aboutDescription: string
    aboutContent1: string
    aboutContent2: string
    aboutContent3: string
    aboutContent4: string
    forConcierges: string
    conciergeContent1: string
    conciergeContent2: string
    conciergeContent3: string
    contactUs: string
    contactDescription: string
    resources: string
    createArticle: string
    titlePlaceholder: string
    contentPlaceholder: string
    authorPlaceholder: string
    publishedDate: string
    createArticleButton: string
    articleCreatedSuccess: string
    articleCreationError: string
    publishedDatePlaceholder: string
}

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    fr: () => import('./dictionaries/fr.json').then((module) => module.default),
}

export const getDictionary = cache(async (locale: string) => {
    const dictionaryLoader = dictionaries[locale as 'en' | 'fr'];
    if (!dictionaryLoader) {
        throw new Error(`No dictionary found for locale: ${locale}`);
    }
    return dictionaryLoader();
})