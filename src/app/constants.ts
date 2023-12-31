export const PORT = process.env.PORT || 4242;
export const HOST = process.env.HOST || 'localhost';
// export const NEXT_STRIPE_CHECKOUT_GATEWAY = 'https://europe-west2-testproject-ddd5e.cloudfunctions.net/id_test4';
export const APP_BASE = process.env.NEXT_PUBLIC_DOMAIN || `http://${process.env.HOST}:${process.env.PORT}`
export const NEXT_STRIPE_CHECKOUT_GATEWAY = process.env.NEXT_STRIPE_CHECKOUT_GATEWAY || `${APP_BASE}/api/checkout`;
export const NEXT_STRIPE_CHECKOUT_FORM = process.env.NEXT_STRIPE_CHECKOUT_FORM || `${APP_BASE}/checkout`;
export const NEXT_STRIPE_CHECKOUT_SUCCESS = process.env.NEXT_STRIPE_CHECKOUT_SUCCESS || `${APP_BASE}/success`;
export const NEXT_STRIPE_CHECKOUT_CANCELED = process.env.NEXT_STRIPE_CHECKOUT_CANCELED || `${APP_BASE}/canceled`;
export const NEXT_STRIPE_CHECK_PAYMENT = process.env.NEXT_STRIPE_CHECK_PAYMENT || `${APP_BASE}/check-payment`;
export const NEXT_STRIPE_LISTENER = process.env.NEXT_STRIPE_LISTENER || `StartUp`;
