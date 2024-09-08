import Link from 'next/link'
import { CITIES, capitalizeCity } from '../../constants/cities'

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
                <li><Link href={`/${lang}/concierge/register`}>{dict.registerConcierge}</Link></li>
                <li>
                    <details>
                        <summary>Villes</summary>
                        <ul className="bg-blue-600 p-2 mt-2">
                            {CITIES.map(city => (
                                <li key={city}>
                                    <Link href={`/${lang}/ville/${city}`}>
                                        {capitalizeCity(city)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </details>
                </li>
            </ul>
        </nav>
    )
}