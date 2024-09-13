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
        } else {
            console.log('Stripe is available in PaymentForm');
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

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/${lang}/register/success`,
            },
            redirect: 'if_required',
        });

        if (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.message || dict.genericError);
            onError(error.message || dict.genericError);
        } else if (paymentIntent) {
            console.log('Payment intent status:', paymentIntent.status);
            switch (paymentIntent.status) {
                case 'succeeded':
                    onSuccess();
                    break;
                case 'requires_payment_method':
                    setErrorMessage('Your payment was not successful, please try again.');
                    break;
                case 'requires_confirmation':
                    // You might want to confirm the payment on the server here
                    break;
                default:
                    setErrorMessage(`Unexpected payment status: ${paymentIntent.status}. Please contact support.`);
                    onError(`Unexpected payment status: ${paymentIntent.status}`);
            }
        } else {
            setErrorMessage('An unexpected error occurred. Please try again.');
            onError('Unexpected error');
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
    const [priceInfo, setPriceInfo] = useState<{ currentPrice: { amount: number, remaining: number }, nextPrice: { amount: number } | null } | null>(null)
    const [error, setError] = useState('')
    const [stripeLoaded, setStripeLoaded] = useState<Stripe | null>(null)
    const router = useRouter()

    useEffect(() => {
        const loadStripeAndInitialize = async () => {
            try {
                const stripe = await stripePromise;
                if (stripe) {
                    setStripeLoaded(stripe);
                } else {
                    throw new Error('Stripe failed to initialize');
                }
            } catch (error) {
                setError(`Failed to load the payment system. Please try refreshing the page.`);
            }
        };

        loadStripeAndInitialize();

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

        fetch('/api/get-current-price')
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setPriceInfo({
                    currentPrice: {
                        amount: data.currentPrice.amount / 100,
                        remaining: data.currentPrice.remaining
                    },
                    nextPrice: data.nextPrice ? { amount: data.nextPrice.amount / 100 } : null
                })
            })
            .catch(error => {
                console.error('Error fetching price info:', error);
                setError('Failed to load pricing information. Please try again.');
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

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${result.error || 'Unknown error'}`);
            }

            if (result.success) {
                router.push(`/${lang}/register/success`);
            } else {
                throw new Error(result.error || 'Payment confirmation failed without specific error');
            }
        } catch (error) {
            setError(`Failed to confirm payment: ${error instanceof Error ? error.message : 'Unknown error'}. Please contact support.`);
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
            {productInfo && priceInfo && (
                <>
                    <h2 className="text-2xl font-semibold mb-2">{productInfo.name}</h2>
                    <p className="mb-4">{productInfo.description}</p>
                    <p className="text-xl font-bold mb-2">
                        {dict.price}: {priceInfo.currentPrice.amount} {productInfo.currency}
                    </p>
                    <p className="mb-2">
                        {priceInfo.currentPrice.remaining} {dict.leftAtCurrentPrice}
                    </p>
                    {priceInfo.nextPrice && (
                        <p className="mb-4">
                            {dict.nextPrice}: {priceInfo.nextPrice.amount} {productInfo.currency}
                        </p>
                    )}
                </>
            )}
            <p className="mb-4">{dict.paymentDescription}</p>
            {clientSecret && stripeLoaded ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm onSuccess={handlePaymentSuccess} onError={handlePaymentError} lang={lang} dict={dict} />
                </Elements>
            ) : (
                <div>
                    {error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div>Loading payment form...</div>
                    )}
                </div>
            )}
        </div>
    )
}