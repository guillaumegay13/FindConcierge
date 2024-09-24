'use client'

import Link from 'next/link'

type NavigationProps = {
    lang: string
    dict: {
        home: string
        search: string
        registerConcierge: string
        about: string
        resources: string
    }
}

export default function Navigation({ lang, dict }: NavigationProps) {
    return (
        <nav className="fixed w-full bg-white z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href={`/${lang}`} className="text-2xl font-bold text-gray-900">
                            Logo
                        </Link>
                    </div>
                    <div className="sm:ml-6 sm:flex sm:space-x-8">
                        <Link href={`/${lang}`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            {dict.home}
                        </Link>
                        <Link href={`/${lang}/search`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            {dict.search}
                        </Link>
                        <Link href={`/${lang}/resources`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            {dict.resources}
                        </Link>
                        <Link href={`/${lang}/about`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                            {dict.about}
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link
                            href={`/${lang}/register`}
                            className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
                        >
                            {dict.registerConcierge}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}