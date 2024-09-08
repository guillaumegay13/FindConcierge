import { getDictionary } from '../../../dictionaries'

// Simuler la récupération des données du concierge
const getConcierge = async (id: string) => {
    // Dans une vraie application, ceci serait une requête à votre API ou base de données
    return {
        id,
        name: `Concierge ${id}`,
        location: "Paris",
        services: ["cleaning", "key management"],
        description: "Experienced concierge service in the heart of Paris."
    }
}

export default async function ConciergePage({ params: { lang, id } }: { params: { lang: string, id: string } }) {
    const dict = await getDictionary(lang)
    const concierge = await getConcierge(id)

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{concierge.name}</h1>
            <p><strong>{dict.location}:</strong> {concierge.location}</p>
            <p><strong>{dict.services}:</strong> {concierge.services.join(', ')}</p>
            <p className="mt-4">{concierge.description}</p>
        </div>
    )
}