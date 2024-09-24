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
        <div className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{dict.about}</h1>
                <div className="w-20 h-1 bg-black mb-8"></div>
                <p className="mb-12 text-xl text-gray-700 leading-relaxed">{dict.aboutDescription}</p>
                <div className="space-y-8 text-gray-700">
                    <p className="leading-relaxed">{dict.aboutContent1}</p>
                    <p className="leading-relaxed">{dict.aboutContent2}</p>
                    <p className="leading-relaxed">{dict.aboutContent3}</p>
                    <p className="leading-relaxed">{dict.aboutContent4}</p>
                </div>
                <div className="mt-16 border-t border-gray-200 pt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{dict.forConcierges}</h2>
                    <div className="space-y-6 text-gray-700">
                        <p className="leading-relaxed">{dict.conciergeContent1}</p>
                        <p className="leading-relaxed">{dict.conciergeContent2}</p>
                        <p className="leading-relaxed">{dict.conciergeContent3}</p>
                    </div>
                    <div className="mt-12 bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">{dict.contactUs}</h3>
                        <p className="text-gray-700 mb-4">{dict.contactDescription}</p>
                        <p className="text-gray-700">
                            Email: <a href={`mailto:${process.env.CONTACT_EMAIL}`} className="text-black hover:underline font-medium">
                                {process.env.CONTACT_EMAIL}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

