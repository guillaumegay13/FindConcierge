import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { getDictionary } from '../dictionaries';

const cities = ['paris', 'lyon', 'marseille', 'bordeaux', 'nice', 'nantes', 'strasbourg', 'montpellier'];

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang);

    return (
        <>
            <NextSeo
                title={dict.title}
                description={dict.description}
                openGraph={{
                    title: dict.title,
                    description: dict.description,
                }}
            />
            <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-8 items-center sm:items-start">
                    <h1 className="text-4xl font-bold">{dict.title}</h1>
                    <p className="text-xl">{dict.description}</p>
                    <div className="flex gap-4 items-center flex-col sm:flex-row">
                        <Link href={`/${lang}/search`} className="rounded-full bg-blue-500 text-white px-6 py-2 hover:bg-blue-600">
                            {dict.searchButton}
                        </Link>
                        <Link href={`/${lang}/register`} className="rounded-full border border-blue-500 text-blue-500 px-6 py-2 hover:bg-blue-50">
                            {dict.registerButton}
                        </Link>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Conciergerie dans les principales villes</h2>
                        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {cities.map(city => (
                                <li key={city}>
                                    <Link href={`/${lang}/ville/${city}`} className="text-blue-500 hover:underline">
                                        Conciergerie {city.charAt(0).toUpperCase() + city.slice(1)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
            </div>
        </>
    );
}

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'fr' }];
}