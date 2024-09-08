import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '../components/Navigation'
import { getDictionary } from '../dictionaries'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../config'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
    const dict = await getDictionary(lang);
    return {
        title: dict.title,
        description: dict.description,
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { lang: string }
}) {
    if (!SUPPORTED_LANGUAGES.includes(params.lang)) {
        redirect(`/${DEFAULT_LANGUAGE}`);
    }

    const dict = await getDictionary(params.lang)

    return (
        <html lang={params.lang}>
            <body className={inter.className}>
                <Navigation lang={params.lang} dict={{ home: dict.home, search: dict.searchButton, registerConcierge: dict.registerButton }} />
                {children}
            </body>
        </html>
    )
}