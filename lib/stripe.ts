import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return stripeInstance;
}

export const PLANS = {
  free: {
    name: 'Free',
    scansPerMonth: 5,
    price: 0,
    features: ['5 scans per month', 'Basic health scoring', 'Ingredient detection'],
  },
  pro: {
    name: 'Pro',
    scansPerMonth: -1,
    price: 4.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    features: [
      'Unlimited scans',
      'Scan history',
      'Detailed ingredient analysis',
      'Personalized recommendations',
      'Export reports',
      'Priority support',
    ],
  },
  business: {
    name: 'Business',
    scansPerMonth: -1,
    price: 29.99,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || '',
    features: [
      'Everything in Pro',
      'API access (1000 calls/month)',
      'Team accounts',
      'Custom integrations',
      'Dedicated support',
    ],
  },
};

export async function createCheckoutSession(userId: string, priceId: string, customerEmail: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    customer_email: customerEmail,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });
  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });
  return session;
}
