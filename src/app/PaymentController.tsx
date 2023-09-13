import { EventType, type PaymentProps, ReduxEvent, PaymentData } from './types.d';
import type { FC } from 'react';

import { useEffect, useState, createContext, useRef } from 'react';
import { APP_BASE, NEXT_STRIPE_CHECKOUT_FORM, NEXT_STRIPE_CHECKOUT_GATEWAY } from './constants';
import { openPopup } from './hooks/openPopup';
// import { payWithPrice1Action } from './actions';
// import { DialogContext, DialogProps } from './DialogController';
import { usePaymentIntent } from './hooks/usePaymentIntent';

const initialPaymentProps = {};
export const PaymentContext = createContext<PaymentProps | undefined>(initialPaymentProps);

function createNonThrottledInterval(callback: () => boolean, interval = 1000) {
  let lastTime = performance.now();

  function animate(currentTime: number) {
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= interval) {
      if (callback()) return;
      lastTime = currentTime;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function getPaymentFormUrl(payload: { price?: string; hash?: string; }) {
  const { price, hash } = payload;

  // return `${NEXT_STRIPE_CHECKOUT_FORM}?price=${price}&hash=${hash}`;
  return `${NEXT_STRIPE_CHECKOUT_FORM}/${price}/${hash}`;
  // return 'https://checkout.stripe.com/c/pay/cs_test_a18OdLV4YjxGSKgZBP4cWIvQhz8IL2NCy98PDUiwgCNVh92TrHqMZqBKzE#fidkdWxOYHwnPyd1blpxYHZxWjA0S2ZKcGtJc0IyUm9BVlBiPGBEZ05OckRUcEFjSEgzTHR2dU1pYUNcfW5PdjFMdjNEcVxnVGAwSDFfcWFrMGZGMkB3R3F9Q2xKX31Sc2RPYHJwXVRIVVxmNTVnQj1Ma0NMTScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl';
  // return 'http://localhost:4242/canceled?session_id=cs_test_a18OdLV4YjxGSKgZBP4cWIvQhz8IL2NCy98PDUiwgCNVh92TrHqMZqBKzE'

  // Stripe Checkout is not able to run in an iFrame. Please redirect to Checkout at the top level.
  return `data:text/html;base64,${btoa(`<html lang="en">\
<body>\
<form action="${NEXT_STRIPE_CHECKOUT_GATEWAY}" method="post">\
<input type="hidden" name="price" value="${price}" />\
<input type="hidden" name="hash" value="${hash}" />\
<div className="absolute inset-0 flex items-center justify-center">\
<button id="submit" type="submit" className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700/80" aria-label="Buy">Buy</button>\
</div>\
</form>\
</body>\
</html>`)}`;
}

export const PaymentController:FC<PaymentProps> = (props) => {
  const { children } = props;
  // const dialogContext = useContext<DialogProps>(DialogContext);
  const [unityEvent, setUnityEvent] = useState<PaymentProps | undefined>();
  const popupRef = useRef<Window | undefined>();
  // needed before any payment request
  // const clientSecret = usePaymentIntent();

  // stripe
  // .confirmCardPayment(clientSecret, {
  //   payment_method: paymentMethodID,
  // })
  // .then(function(result) {
  //   // Handle result.error or result.paymentIntent
  // });


  useEffect(() => {
    // @ts-ignore
    // if (!window.Service) return;
    // @ts-ignore
    // const worker = new window.Service();
    let stopWatching = false;
    const onMessage = (event: MessageEvent<string>) => {
      // TODO: Security check
      if (event.origin !== APP_BASE) return;
      // if (typeof event.data !== 'string') return;

      try  {
        const data:ReduxEvent<EventType, PaymentData> = JSON.parse(event.data);

        console.log(data);
        switch (data.type) {
          // case EventType.UNITY_PLAYER_PAY: {
          //   console.log('here', data)
          //   return;
          // }
          // /* With Stripe component */
          // case EventType.UNITY_PLAYER_PAY: {
          //   console.log('Catch UNITY_PLAYER_PAY event', data)
          //   setUnityEvent({ price: data.payload.price, customerID: data.payload.customerID });
          //   return;
          // }
          /* With Popup */
          case EventType.UNITY_PLAYER_PAY: {
            if (!popupRef) return;
            console.log('Catch UNITY_PLAYER_PAY event', !!popupRef.current, data.payload);
            if (popupRef.current) return;
            popupRef.current = openPopup(getPaymentFormUrl(data.payload), function () {
              this.addEventListener('beforeunload', () => {
                console.log("Popup closed")
                popupRef.current = undefined;
                // WARN: Popup can be closed before payment changed his status
                // stopWatching = true;
              });
            });
            // dialogContext.openDialog?.(url);

            const hash = data.payload.hash;
            createNonThrottledInterval(() => {
              // worker.postMessage(JSON.stringify({ type: 'PING' }));
              const body = new FormData();
              body.append('hash', `${hash}`);
              fetch(`${APP_BASE}/api/check-payment`, { method: 'POST', body })
                .then((res) => {
                  if (!res.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return res.json(); // Parse the response as JSON
                })
                .then((data) => {
                  // Handle the response data here
                  console.log('Response data:', data);

                  if (data.payment_status === 'paid') {
                    postMessage(JSON.stringify({ type: EventType.UNITY_PLAYER_AFTER_PAY, payload: { message: 'Maksājums veiksmīgs', hash, status: data.payment_status } }), APP_BASE);
                  }
                  if (data.payment_status && data.payment_status !== 'unpaid') {
                    stopWatching = true;
                    popupRef.current?.close()
                  }
                })
                .catch((error) => {
                  // Handle any errors that occurred during the fetch
                  console.error('Fetch error:', error);
                });
              return stopWatching
            });
            return;
          }
          case EventType.UNITY_PLAYER_AFTER_PAY: {
            // Forward event to the parent window
            // if (window.parent) {
            //   window.parent.postMessage(event.data, APP_BASE);
            //   stopWatching = true;
            //   // popup.close();
            // }
            if (!data) return;
            setUnityEvent({ paymentStatus: data.payload.status });
            return;
          }
          default: {
            return;
          }
        }

      } catch (e) {
        console.error('Cannot parse event data', e);
        console.debug(event.data);
        return;
      }

      // worker.postMessage(
      //   JSON.stringify({ type: "PONG", payload: { message: "Message received" } }),
      //   { targetOrigin: APP_BASE }
      // );
    };

    console.debug('setup worker')
    // worker.addEventListener("message", onMessage);
    window.addEventListener("message", onMessage, false);

    // DEV: Send payment event to myself
    // setTimeout(() => {
    //   window.postMessage(JSON.stringify(payWithPrice1Action()), APP_BASE);
    // }, 5000);

    return () => {
      // worker.removeEventListener("message", onMessage);
      window.removeEventListener("message", onMessage);
      popupRef.current = undefined;
    }
  }, [])

  // useEffect(() => {
  //   if (!unityEvent?.price) return;
  //   dialogContext.openDialog?.('https://buy.stripe.com/test_9AQ5lZ7jQgEm0pi5kk');
  // }, [unityEvent, dialogContext])

  return (
    <PaymentContext.Provider value={unityEvent}>
        {children}
    </PaymentContext.Provider>
  )
}