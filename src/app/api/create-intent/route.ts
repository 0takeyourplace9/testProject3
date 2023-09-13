const stripe = require('stripe')(process.env.NEXT_STRIPE_PUBLIC_KEY);

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const intent = await stripe.paymentIntents.create({
    amount: 1,
    currency: 'eur',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {enabled: true},
  });
  return NextResponse.json({client_secret: intent.client_secret});
}
