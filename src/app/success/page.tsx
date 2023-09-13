'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';
import { EventType, PaymentStatus_unsafe } from '../types.d';

export default function Success () {
  // const searchParams = useSearchParams()
  // const sessionID = searchParams.get('session_id')

  // useEffect(() => {
  //   if (!sessionID) return;
  //   // @ts-ignore
  //   // if (!window.Service) return;
  //   // @ts-ignore
  //   const worker = new window.Service();
  //   const event = {
  //     type: EventType.UNITY_PLAYER_AFTER_PAY,
  //     payload: {
  //       message: 'Klientam izdevas apmaksat',
  //       sessionID,
  //       status: PaymentStatus_unsafe.SUCCESS,
  //     }
  //   }
  //   worker.postMessage(JSON.stringify(event));
  //   window.setTimeout(window.close, 5000);
  // }, [sessionID])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/success/page.tsx</code>
        </p>
        <p>Paldies par pirkumu!</p>
        <p>Logs aizveras pec 5 sekundēm</p>
        <a onClick={() => {window.close();}}>Aizveret</a>
      </div>
    </main>
  )
}
