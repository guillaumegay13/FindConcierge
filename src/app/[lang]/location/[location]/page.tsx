import { getDictionary } from '../../../dictionaries';
import { notFound } from 'next/navigation';
import { LOCATIONS, Location, capitalizeLocation } from '../../../../constants/locations';
import type { Metadata } from 'next';

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
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-4xl font-bold mb-4">{dict.conciergerieIn} {capitalizedLocation}</h1>
            <p className="text-xl mb-6">
                {dict.discoverBestConciergeServices} {capitalizedLocation} {dict.forYourAirbnb}
            </p>
            {/* Add more city-specific content here */}
        </div>
    );
}