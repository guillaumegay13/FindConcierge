import Link from 'next/link'

type NavigationProps = {
    lang: string
    dict: {
        home: string
        search: string
        registerConcierge: string
    }
}

export default function Navigation({ lang, dict }: NavigationProps) {
    return (
        <nav className="bg-blue-500 p-4">
            <ul className="flex space-x-4 text-white">
                <li><Link href={`/${lang}`}>{dict.home}</Link></li>
                <li><Link href={`/${lang}/search`}>{dict.search}</Link></li>
                <li><Link href={`/${lang}/register`}>{dict.registerConcierge}</Link></li>
            </ul>
        </nav>
    )
}