import { getDictionary } from '../../../dictionaries';
import { notFound } from 'next/navigation';
import { LOCATIONS, Location, capitalizeLocation } from '../../../../constants/locations';
import type { Metadata } from 'next';
import Head from 'next/head';

export async function generateStaticParams() {
    return LOCATIONS.map(location => ({ location }));
}

export async function generateMetadata({ params: { lang, location } }: { params: { lang: string, location: Location } }): Promise<Metadata> {
    const dict = await getDictionary(lang);
    const capitalizedLocation = capitalizeLocation(location);

    return {
        title: `${dict.conciergerieIn} ${capitalizedLocation} | ${dict.servicesForAirbnb}`,
        description: `${dict.findBestConciergeService} ${capitalizedLocation} ${dict.forYourAirbnb}`,
        openGraph: {
            title: `${dict.conciergerieIn} ${capitalizedLocation} | ${dict.servicesForAirbnb}`,
            description: `${dict.findBestConciergeService} ${capitalizedLocation} ${dict.forYourAirbnb}`,
        },
    };
}

export default async function LocationPage({ params: { lang, location } }: { params: { lang: string, location: Location } }) {
    if (!LOCATIONS.includes(location)) {
        notFound();
    }

    const dict = await getDictionary(lang);
    const capitalizedLocation = capitalizeLocation(location);

    return (
        <div className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <Head>
                <title>{`${dict.conciergerieIn} ${capitalizedLocation} | ${dict.servicesForAirbnb}`}</title>
            </Head>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {dict.conciergerieIn} {capitalizedLocation}
                </h1>
                <div className="w-20 h-1 bg-black mb-8"></div>
                <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                    {dict.discoverBestConciergeServices} {capitalizedLocation} {dict.forYourAirbnb}
                </p>
                {/* Add more city-specific content here */}
            </div>
        </div>
    );
}