import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import resend from '../../lib/resend'
import { SERVICES, Service } from '../../../constants/services'
import frDictionary from '../../dictionaries/fr.json';

function validateEmail(email: string) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function validatePhone(phone: string) {
    const re = /^\+?[0-9]{10,14}$/;
    return re.test(phone);
}

function validateUrl(url: string) {
    if (!url) return true; // Allow empty URL
    const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,})([\/\w \.-]*)*\/?$/i;
    return re.test(url);
}

function normalizeUrl(url: string): string {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
    }
    return url;
}

function validateServices(services: Service[]) {
    return services.every(service => SERVICES.includes(service));
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { businessName, email, phone, website, services, location, description } = body

        // Validate inputs
        if (!businessName || businessName.length < 2) {
            return NextResponse.json({ message: 'Invalid business name' }, { status: 400 })
        }
        if (!validateEmail(email)) {
            return NextResponse.json({ message: 'Invalid email address' }, { status: 400 })
        }
        if (!validatePhone(phone)) {
            return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 })
        }
        if (!validateUrl(website)) {
            return NextResponse.json({ message: 'Invalid website URL' }, { status: 400 })
        }
        const normalizedWebsite = normalizeUrl(website);

        const client = await clientPromise
        const db = client.db("conciergeRepository")

        const result = await db.collection("concierges").insertOne({
            businessName,
            email,
            phone,
            website: normalizedWebsite,
            services: services.map((service: Service) => ({
                en: service,
                fr: frDictionary[service as keyof typeof frDictionary] || service
            })),
            location: location.map((loc: string) => ({
                en: loc,
                fr: (frDictionary as Record<string, string>)[loc] || loc
            })),
            description,
            createdAt: new Date(),
            paymentStatus: 'pending'
        })

        console.log('Registration successful, inserted ID:', result.insertedId);

        // Send email notification
        await sendEmailNotification(body)

        return NextResponse.json({ message: 'Registration successful', id: result.insertedId }, { status: 201 })
    } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message: 'Registration failed', error: errorMessage }, { status: 500 });
    }
}

async function sendEmailNotification(conciergeData: {
    businessName: string;
    email: string;
    location: string;
    services: Service[];
}) {
    try {
        if (process.env.DEV_NOTIFICATION_EMAIL) {
            await resend.emails.send({
                from: 'Concierge Registration <onboarding@resend.dev>',
                to: process.env.DEV_NOTIFICATION_EMAIL,
                subject: 'Youhou! Une nouvelle conciergerie vient de s\'inscrire 🥳',
                html: `
                <ul>
                    <li><strong>Business Name:</strong> ${conciergeData.businessName}</li>
                    <li><strong>Email:</strong> ${conciergeData.email}</li>
                    <li><strong>Location:</strong> ${conciergeData.location}</li>
                    <li><strong>Services:</strong> ${conciergeData.services.join(', ')}</li>
                </ul>
            `,
            });
            console.log('Email notification sent successfully');
        } else {
            console.log('No DEV_NOTIFICATION_EMAIL set, email notification not sent');
        }
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
}
