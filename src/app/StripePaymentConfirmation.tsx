'use client'
import type { FC } from "react";
import { useState } from "react";
import { NEXT_STRIPE_CHECKOUT_GATEWAY } from "./constants";

export interface PayByCardFormProps {
  price?: string;
  hash?: string;
}

export const StripePaymentConfirmation:FC<PayByCardFormProps> = (props) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { price, hash } = props;

  const handleSubmit = () => {
    setSubmitting(true);
  };

  if (!price) return null;
  if (!hash) return null;

  return (
    <form onSubmit={handleSubmit} action={NEXT_STRIPE_CHECKOUT_GATEWAY} method="post">
      <input type="hidden" name="price" value={price} />
      <input type="hidden" name="hash" value={hash} />
      <div className="absolute inset-0 flex items-center justify-center">
        <button type="submit" className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700/80"
  aria-label="Buy" disabled={isSubmitting}>Buy</button>
      </div>
    </form>
  );
}
