import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import Article from '../../components/Article';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, author, publishedDate } = body;

        // Validate the input
        if (!title || !content || !author || !publishedDate) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Connect to the database
        const client = await clientPromise;
        const db = client.db("conciergeRepository");

        // Create a new article
        const newArticle = new Article({
            title,
            content,
            author,
            publishedDate: new Date(publishedDate)
        });

        // Save the article to the database
        await newArticle.save();

        return NextResponse.json({ message: 'Article created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({ message: 'Error creating article', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}