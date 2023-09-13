import { PaymentProps } from "./types.d";

export const selectPrice = (store: PaymentProps) => store.price;
export const selectMessage = (store: PaymentProps) => store.message;
export const selectPaymentSessionId = (store: PaymentProps) => store.paymentSessionID;
export const selectPaymentStatus = (store: PaymentProps) => store.paymentStatus;
export const selectPaymentMessage = (store: PaymentProps) => store.paymentMessage;