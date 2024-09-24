import '../globals.css'
import type { Metadata } from 'next'
import Navigation from '../components/Navigation'
import { getDictionary } from '../dictionaries'
import ClientLayout from './ClientLayout'
import { Analytics } from '@vercel/analytics/react';

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

    const dict = await getDictionary(params.lang)

    return (
        <html lang={params.lang} suppressHydrationWarning>
            <body className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
                <ClientLayout>
                    <Navigation lang={params.lang} dict={{ home: dict.home, search: dict.searchButton, registerConcierge: dict.registerButton, about: dict.about, resources: dict.resources }} />
                    {children}
                </ClientLayout>
                <Analytics />
            </body>
        </html>
    )
}