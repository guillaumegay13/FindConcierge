import Link from 'next/link'
import { getDictionary } from '../dictionaries'
import { Metadata } from 'next'
import VisitorStats from '../components/VisitorStats'

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
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center sm:items-start">
                <h1 className="text-4xl font-bold">{dict.title}</h1>
                <p className="text-xl">{dict.description}</p>
                <VisitorStats lang={lang} />
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Link href={`/${lang}/search`} className="rounded-full bg-blue-500 text-white px-6 py-2 hover:bg-blue-600">
                        {dict.searchButton}
                    </Link>
                    <Link href={`/${lang}/register`} className="rounded-full border border-blue-500 text-blue-500 px-6 py-2 hover:bg-blue-50">
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