'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateArticlePage({ params: { lang } }: { params: { lang: string } }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        publishedDate: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/articles/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess('Article created successfully');
                setFormData({
                    title: '',
                    content: '',
                    author: '',
                    publishedDate: ''
                });
            } else {
                setError(result.message || 'Error creating article');
            }
        } catch (error) {
            setError('Error creating article');
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">Create Article</h1>
                <div className="w-20 h-1 bg-black mb-8"></div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                    />
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Content"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        rows={6}
                        required
                    />
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Author"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                    />
                    <input
                        type="date"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleChange}
                        placeholder="Published Date"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        required
                    />
                    <button type="submit" className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-200">
                        Create Article
                    </button>
                </form>
            </div>
        </div>
    );
}