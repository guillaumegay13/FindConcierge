import { NextSeo } from 'next-seo';
import { getDictionary } from '../../../dictionaries';
import { notFound } from 'next/navigation';
import { CITIES, City, capitalizeCity } from '../../../../constants/cities';

export async function generateStaticParams() {
    return CITIES.map(city => ({ city }));
}

export default async function CityPage({ params: { lang, city } }: { params: { lang: string, city: City } }) {
    if (!CITIES.includes(city)) {
        notFound();
    }

    const dict = await getDictionary(lang);
    const capitalizedCity = capitalizeCity(city);

    return (
        <>
            <NextSeo
                title={`Conciergerie ${capitalizedCity} | Services pour Airbnb et Location Courte Durée`}
                description={`Trouvez le meilleur service de conciergerie à ${capitalizedCity} pour votre location Airbnb ou courte durée. Gestion professionnelle et services sur mesure.`}
                openGraph={{
                    title: `Conciergerie ${capitalizedCity} | Services pour Airbnb et Location Courte Durée`,
                    description: `Trouvez le meilleur service de conciergerie à ${capitalizedCity} pour votre location Airbnb ou courte durée. Gestion professionnelle et services sur mesure.`,
                }}
            />
            <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <h1 className="text-4xl font-bold mb-4">Conciergerie {capitalizedCity}</h1>
                <p className="text-xl mb-6">
                    Découvrez les meilleurs services de conciergerie à {capitalizedCity} pour votre location Airbnb ou courte durée.
                </p>
                {/* Add more city-specific content here */}
            </div>
        </>
    );
}