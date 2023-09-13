'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useCallback } from 'react';
import { EventType, PaymentStatus_unsafe } from '../types.d';
import { APP_BASE } from '../constants';

// const usePayCallback = () => {
//   useEffect(() => {
//     const searchParams = new URLSearchParams(document.location.search);
//     const sessionID = searchParams.get('session_id')

//     // // @ts-ignore
//     // const worker = new window.Service();
//     // const event = {
//     //   type: EventType.UNITY_PLAYER_AFTER_PAY,
//     //   payload: {
//     //     message: 'Klients atteicas maksat',
//     //     sessionID,
//     //     status: PaymentStatus_unsafe.CANCELED,
//     //   }
//     // }
//     // try { worker.postMessage(JSON.stringify(event)); } catch (e) { console.log(e); }
//     try { window.parent.postMessage(JSON.stringify(event)); } catch (e) { console.log(e); }
//     try { postMessage(JSON.stringify(event), APP_BASE); } catch (e) { console.log(e); }
//     // window.setTimeout(window.close, 5000);
//   }, [])
// }

// const usePayCallback = () => {
//   const searchParams = useSearchParams()
//   const sessionID = searchParams.get('session_id')

//   useEffect(() => {
//       if (!sessionID) return;
//       // @ts-ignore
//       console.log(sessionID, window.Service )
//       // @ts-ignore
//       // if (!window.Service) return;

//       const DOMContentLoaded = () => {
//         // @ts-ignore
//         const worker = new window.Service();
//         const event = {
//           type: EventType.UNITY_PLAYER_AFTER_PAY,
//           payload: {
//             message: 'Klients atteicas maksat',
//             sessionID,
//             status: PaymentStatus_unsafe.CANCELED,
//           }
//         }
//         console.log(event);
//         worker.postMessage(JSON.stringify(event));
//         // window.setTimeout(window.close, 5000);
//       }
//       document.addEventListener('DOMContentLoaded', DOMContentLoaded)
//   }, [sessionID])
// }


export default function Canceled () {
  // usePayCallback();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/canceled/page.tsx</code>
        </p>
        <p>Mēs ceram, ka jūs atgriezīsities.</p>
        <p>Logs aizveras pec 5 sekundēm</p>
        <a onClick={() => {window.close();}}>Aizveriet</a>
      </div>
    </main>
  )
}
