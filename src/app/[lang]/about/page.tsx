import { getDictionary } from '@/app/dictionaries'
import { Metadata } from 'next'

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
    const dict = await getDictionary(lang)
    return {
        title: `${dict.about}`,
        description: dict.aboutDescription,
    }
}

export default async function About({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang)

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-6">{dict.about}</h1>
            <p className="mb-4 text-lg">{dict.aboutDescription}</p>
            <div className="space-y-6">
                <p>{dict.aboutContent1}</p>
                <p>{dict.aboutContent2}</p>
                <p>{dict.aboutContent3}</p>
                <p>{dict.aboutContent4}</p>
            </div>
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">{dict.forConcierges}</h2>
                <p>{dict.conciergeContent1}</p>
                <p>{dict.conciergeContent2}</p>
                <p>{dict.conciergeContent3}</p>
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-2">{dict.contactUs}</h3>
                    <p>{dict.contactDescription}</p>
                    <p className="mt-2">
                        Email: <a href={`mailto:${process.env.CONTACT_EMAIL}`} className="text-blue-500 hover:underline">
                            {process.env.CONTACT_EMAIL}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

