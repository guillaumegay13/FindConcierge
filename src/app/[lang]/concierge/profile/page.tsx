import { getDictionary } from '../../../dictionaries'
import ConciergeProfileForm from '../../../components/ConciergeProfileForm'

export default async function ConciergeProfilePage({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang)

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{dict.conciergeProfileTitle}</h1>
            <ConciergeProfileForm lang={lang} />
        </div>
    )
}