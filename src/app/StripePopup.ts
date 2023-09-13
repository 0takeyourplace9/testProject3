'use client'
import type { FC, MutableRefObject } from "react";
import type { PaymentProps, UnityInstance } from "./types.d";
import { useContext, useEffect, useMemo } from "react";
import { PaymentContext } from "./PaymentController";
import { selectPrice, selectPaymentSessionId, selectPaymentStatus, selectPaymentMessage } from "./selectors";
import { NEXT_STRIPE_CHECKOUT_FORM } from "./constants";
import { UnityAppContext } from "./app";

export interface StripePopupProps {
}

export const StripePopup:FC<StripePopupProps> = () => {
  const appContext = useContext<PaymentProps | undefined>(PaymentContext);
  const price = useMemo(() => appContext && selectPrice(appContext), [appContext])
  const sessionID = useMemo(() => appContext && selectPaymentSessionId(appContext), [appContext])
  const status = useMemo(() => appContext && selectPaymentStatus(appContext), [appContext])
  const message = useMemo(() => appContext && selectPaymentMessage(appContext), [appContext])
  const unityInstance = useContext<MutableRefObject<UnityInstance | undefined>>(UnityAppContext);

  useEffect(() => {
    if (!price) return;
    const popup = window.open(`${NEXT_STRIPE_CHECKOUT_FORM}?price=${price}`, '_blank');
    if (!popup) return;
    popup.onload = () => {
      // @ts-ignore
      const worker = new window.Service();
      worker.addEventListener('message', (event: MessageEvent) => {
      });
    }
  }, [price])

  useEffect(() => {
    if (!sessionID) return;
    if (!status) return;
    unityInstance?.current?.SendMessage?.('player1(Clone)', 'OnMessage', JSON.stringify({
      type: 'UNITY_PLAYER_AFTER_PAY',
      payload: {
        message,
        sessionID,
        status,
      }
    }));
  }, [sessionID, status, message, unityInstance])

  return JSON.stringify({
    sessionID, status, message,
    price
  })
  return null;
}
