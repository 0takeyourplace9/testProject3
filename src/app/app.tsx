'use client'
import { type UnityInstance, type PaymentProps } from './types.d';
import type { FC, MutableRefObject } from 'react';

import { createContext } from 'react';
import './app.css'
import { PaymentController } from './PaymentController';
import { DialogController } from './DialogController';
import { UnityAppController } from './UnityAppController';
import { StripeController } from './StripeController';
import { VeriffController } from './VeriffController';

export const UnityAppContext = createContext<MutableRefObject<UnityInstance | undefined>>({ current: undefined });

export const App: FC<PaymentProps> = (props) => {
  const { children } = props;

  return (
    <VeriffController>
      <UnityAppController>
      {/* <DialogController> */}
          <PaymentController>
            {/* <StripeController> */}
              {children}
            {/* </StripeController> */}
          </PaymentController>
      {/* </DialogController> */}
      </UnityAppController>
    </VeriffController>
  );
}
