import Link from 'next/link'
import { getDictionary } from '../dictionaries'
import { Metadata } from 'next'

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
    const dict = await getDictionary(lang)
    return {
        title: dict.title,
        description: dict.description,
    }
}

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang)

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <main className="max-w-4xl w-full px-6 py-24 text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {dict.title}
                </h1>
                <div className="w-20 h-1 bg-black mx-auto mb-8"></div>
                <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
                    {dict.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                        href={`/${lang}/search`}
                        className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                    >
                        {dict.searchButton}
                    </Link>
                    <Link
                        href={`/${lang}/register`}
                        className="inline-block border-2 border-black text-black px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                    >
                        {dict.registerButton}
                    </Link>
                </div>
            </main>
        </div>
    )
}

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'fr' }];
}