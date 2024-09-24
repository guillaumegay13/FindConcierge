import mongoose, { Schema, Document } from 'mongoose';

interface Article extends Document {
    title: string;
    content: string;
    author: string;
    publishedDate: Date;
}

const ArticleSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, required: true }
});

export default mongoose.models.Article || mongoose.model<Article>('Article', ArticleSchema);