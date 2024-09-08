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
                title={`${dict.conciergerieIn} ${capitalizedCity} | ${dict.servicesForAirbnb}`}
                description={`${dict.findBestConciergeService} ${capitalizedCity} ${dict.forYourAirbnb}`}
                openGraph={{
                    title: `${dict.conciergerieIn} ${capitalizedCity} | ${dict.servicesForAirbnb}`,
                    description: `${dict.findBestConciergeService} ${capitalizedCity} ${dict.forYourAirbnb}`,
                }}
            />
            <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <h1 className="text-4xl font-bold mb-4">{dict.conciergerieIn} {capitalizedCity}</h1>
                <p className="text-xl mb-6">
                    {dict.discoverBestConciergeServices} {capitalizedCity} {dict.forYourAirbnb}
                </p>
                {/* Add more city-specific content here */}
            </div>
        </>
    );
}