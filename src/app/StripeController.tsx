import React, { FC, ReactNode, useContext, useMemo } from 'react';
import {Elements, } from '@stripe/react-stripe-js';
import { type StripeElementsOptionsMode } from '@stripe/stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import { PaymentContext } from './PaymentController';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(`${process.env.NEXT_STRIPE_PUBLIC_KEY}`);

export const StripeController:FC<{ children?: ReactNode }> = (props) => {
  const { children } = props;
  const paymentContext = useContext(PaymentContext);
  const { price } = paymentContext || {};
  const options = useMemo(() => ({
      mode: 'payment' as StripeElementsOptionsMode['mode'],
      line_items: [
        {
          price: price ?? 0, // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          quantity: 1,
        },
      ],
      amount: 1,
      currency: 'eur',
      // Customizable with appearance API.
      appearance: {/*...*/},
    }), [price]);

  if (!price) return null

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
