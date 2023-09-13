'use client'

import { StripePaymentConfirmation } from "../../../StripePaymentConfirmation";

export default function Checkout (props: { params: { price: string, hash: string } }) {
  const { price, hash } = props.params

  return (
    <StripePaymentConfirmation price={`${price}`} hash={`${hash}`}/>
  );
}
