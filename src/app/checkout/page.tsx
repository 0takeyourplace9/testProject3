'use client'

import { useEffect, useState } from "react";
import { StripePaymentConfirmation } from "../StripePaymentConfirmation";

export default function Checkout () {
  const [state, setState] = useState<{ price?: string | null; hash?: string | null; }>();

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    const price = searchParams.get('price')
    const hash = searchParams.get('hash')
    setState({ price, hash });
  }, []);

  if (!state) return null;

  return (
    <StripePaymentConfirmation price={`${state?.price}`} hash={`${state?.hash}`} />
  );
}
