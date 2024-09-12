import { NextResponse } from 'next/server';

async function fetchVercelAnalytics(metric: string, interval: string) {
    console.log('Project ID:', process.env.VERCEL_PROJECT_ID);
    console.log('Token:', process.env.VERCEL_TOKEN ? 'Set' : 'Not set');

    const url = `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/stats/${metric}?interval=${interval}`;
    console.log('Fetching URL:', url);

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        },
    });

    if (!response.ok) {
        console.log('Response status:', response.status);
        console.log('Response text:', await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.metrics[0].value;
}

export async function GET() {
    try {
        const [today, pastWeek] = await Promise.all([
            fetchVercelAnalytics('pageviews', '1d'),
            fetchVercelAnalytics('pageviews', '7d'),
        ]);

        // Note: 'live' visitors are not directly available through this API
        // We'll use a placeholder for now
        const live = Math.floor(today / 24); // Rough estimate

        return NextResponse.json({
            today,
            pastWeek,
            live,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}