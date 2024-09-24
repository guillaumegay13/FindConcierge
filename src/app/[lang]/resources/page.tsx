'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Article = {
    _id: string;
    title: string;
    content: string;
    author: string;
    publishedDate: string;
};

type ResourcesProps = {
    lang: string;
};

const Resources = ({ lang }: ResourcesProps) => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            const res = await fetch(`/api/articles`);
            const data: Article[] = await res.json();
            setArticles(data);
        };

        fetchArticles();
    }, [lang]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
            <ul className="mt-6 space-y-4">
                {articles.map((article) => (
                    <li key={article._id} className="border-b pb-4">
                        <Link href={`/${lang}/resources/${article._id}`}>
                            <a className="text-xl font-semibold text-blue-600 hover:underline">
                                {article.title}
                            </a>
                        </Link>
                        <p className="mt-2 text-gray-700">{article.content}</p>
                        <p className="mt-1 text-gray-500">By {article.author} on {new Date(article.publishedDate).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Resources;