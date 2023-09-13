import React, { useState } from 'react';
import {useStripe, useElements, ExpressCheckoutElement} from '@stripe/react-stripe-js';
import { usePaymentIntent } from './hooks/usePaymentIntent';

export const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const clientSecret = usePaymentIntent();
  const onConfirm = async () => {
    if (!stripe) {
      // Stripe.js hasn't loaded yet.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error: submitError } = await elements?.submit() || {};
    if (submitError?.message) {
      setErrorMessage(submitError.message);
      return;
    }

    if (!clientSecret) return;

    // Confirm the PaymentIntent using the details collected by the Express Checkout Element
    const {error, ...restPaymentDetails } = await stripe.confirmPayment({
      // `elements` instance used to create the Express Checkout Element
      elements: elements ?? undefined,
      // `clientSecret` from the created PaymentIntent
      clientSecret,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.

      console.debug('Finally', restPaymentDetails)
    }
  }
  return (
    <div id="checkout" style={{ width: 400, height: 500 }}>
      <ExpressCheckoutElement onConfirm={onConfirm} />
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};
