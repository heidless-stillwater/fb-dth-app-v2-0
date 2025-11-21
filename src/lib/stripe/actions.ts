'use server';

import { stripe } from '.';

export async function createStripeCheckoutSession(priceId: string, userEmail: string): Promise<string | null> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL is not set in the environment variables.');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
    });

    return session.url;
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return null;
  }
}
