'use client'

import { useState, useEffect } from 'react'
import { getDictionary } from '../../../dictionaries'
import { Dictionary } from '../../../dictionaries'
import { useRouter } from 'next/navigation'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ onSuccess, onError, lang, dict }: { onSuccess: () => void, onError: (error: string) => void, lang: string, dict: Dictionary }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!stripe) {
            console.error('Stripe.js has not loaded yet.');
            setErrorMessage('There was a problem loading the payment system.');
        }
    }, [stripe]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage('The payment system is not ready. Please try again.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/${lang}/register/success`,
            },
        });

        if (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.message || dict.genericError);
            onError(error.message || dict.genericError);
        } else {
            onSuccess();
        }

        setIsProcessing(false);
    };

    if (errorMessage) {
        return <div className="text-red-500">{errorMessage}</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
                {isProcessing ? dict.processing : dict.pay}
            </button>
        </form>
    );
}

export default function Payment({ params: { lang, id } }: { params: { lang: string, id: string } }) {
    const [dict, setDict] = useState<Dictionary>({} as Dictionary)
    const [clientSecret, setClientSecret] = useState('')
    const [productInfo, setProductInfo] = useState<{ name: string, description: string, price: number, currency: string } | null>(null)
    const [error, setError] = useState('')
    const [stripeLoaded, setStripeLoaded] = useState<Stripe | null>(null)
    const router = useRouter()

    useEffect(() => {
        console.log('Stripe Publishable Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        stripePromise.then(
            (stripe) => {
                console.log('Stripe loaded successfully');
                setStripeLoaded(stripe);
            },
            (error) => {
                console.error('Failed to load Stripe:', error);
                setError('Failed to load the payment system. Please try again later.');
            }
        );

        getDictionary(lang).then(setDict)

        fetch('/api/get-product-info')
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setProductInfo({
                    name: data.product.name,
                    description: data.product.description,
                    price: data.price.unit_amount / 100,
                    currency: data.price.currency.toUpperCase()
                })
            })
            .catch(error => {
                console.error('Error fetching product info:', error);
                setError('Failed to load product information. Please try again.');
            });

        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conciergeId: id }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setClientSecret(data.clientSecret)
            })
            .catch(error => {
                console.error('Error creating PaymentIntent:', error);
                setError('Failed to initialize payment. Please try again.');
            });
    }, [lang, id])

    const handlePaymentSuccess = async () => {
        try {
            const response = await fetch(`/api/concierge/${id}/confirm-payment`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            router.push(`/${lang}/concierge/${id}`)
        } catch (error) {
            console.error('Payment confirmation error:', error);
            setError('Failed to confirm payment. Please contact support.');
        }
    }

    const handlePaymentError = (error: string) => {
        console.error('Payment error:', error);
        setError(error);
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-4">{dict.paymentTitle}</h1>
            {productInfo && (
                <>
                    <h2 className="text-2xl font-semibold mb-2">{productInfo.name}</h2>
                    <p className="mb-4">{productInfo.description}</p>
                    <p className="text-xl font-bold mb-8">
                        {dict.price}: {productInfo.price} {productInfo.currency}
                    </p>
                </>
            )}
            <p className="mb-4">{dict.paymentDescription}</p>
            {clientSecret && stripeLoaded ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm onSuccess={handlePaymentSuccess} onError={handlePaymentError} lang={lang} dict={dict} />
                </Elements>
            ) : (
                <div>Loading payment form...</div>
            )}
        </div>
    )
}