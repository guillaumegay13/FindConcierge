import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function createArticle(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("conciergeRepository");

    // Extract article data from the request body
    const articleData = req.body;

    // Use the db variable to create a new article
    await db.collection('articles').insertOne(articleData);

    res.status(201).json({ message: 'Article created successfully' });
}