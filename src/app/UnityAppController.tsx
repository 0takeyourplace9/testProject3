'use client'
import { type UnityInstance, type PaymentProps, EventType } from './types.d';
import type { FC, MutableRefObject } from 'react';

import { useEffect, useRef, useState, createContext, useContext } from 'react';
import './app.css'
import { Loader } from './Loader';
import configDev from './config.json';
import configProd from './config.production.json';
import metadataJSONDev from './metadata.json'
import metadataJSONProd from './metadata.production.json'
import { APP_BASE, NEXT_STRIPE_LISTENER } from './constants';
import { VeriffContext } from './VeriffController';

const metadataJSON = (false) ? metadataJSONDev : metadataJSONProd;
const config = (false) ? configDev : configProd;

const Banner = (props: { message: string; type: string; }) => {
  const { type, message } = props;
  let bannerClasses = 'bg-blue-500 text-white';

  switch (type) {
    case 'warning':
      bannerClasses = 'bg-yellow-500 text-black';
      break;
    case 'error':
      bannerClasses = 'bg-red-500 text-white';
      break;
    case 'notice':
      bannerClasses = 'bg-green-500 text-white';
      break;
    default:
      break;
  }

  return (
    <div className={bannerClasses + ' p-4'}>
      <div className="container mx-auto text-center">
        {/* <p className="text-2xl font-semibold"></p> */}
        <p className="text-sm mt-2">{message}</p>
      </div>
    </div>
  );
};

export const metadata = metadataJSON;

export const UnityAppContext = createContext<MutableRefObject<UnityInstance | undefined>>({ current: undefined });

export const UnityAppController: FC<PaymentProps> = (props) => {
  const { children } = props;
  const [loading, setLoading] = useState(true);
  const unityInstance = useRef<UnityInstance | undefined>();
  const ref = useRef<HTMLCanvasElement>(null);
  const [banner, setBanner] = useState<{ message: string; type: string; } | undefined>();
  const veriffContext = useContext(VeriffContext);
  const onFullScreen = () => {
    if (!unityInstance.current) return;
    unityInstance.current.SetFullscreen?.(true);
  }

  useEffect(() => {
    if (!ref.current) return;
    // @ts-ignore
    window.createUnityInstance?.(
      ref.current,
      config,
      (gameInstance: { removeTimeout?: unknown, Module: unknown }, progress: number) => {
        if (!gameInstance.Module) {
          return;
        }
        if (progress === 1 && !gameInstance.removeTimeout) {
          gameInstance.removeTimeout = setTimeout(function () {
            setLoading(false);
          }, 2000);
        }
      },
      )
      .then((gameInstance: UnityInstance) => {
        unityInstance.current = gameInstance;
        veriffContext?.SetUnityPlayer?.(gameInstance);
        console.info('Loaded the game');
        document.getElementById('loader')?.classList.add('hidden');
      })
      .catch((err: unknown) => {
        console.error('Failed to load the game');
        console.debug(err)
      })
      .then(() => {
        const onMessage = (event: MessageEvent) => {
          if (event.origin !== APP_BASE) return;
          // if (typeof event.data !== 'string') return;

          try  {
            const data = JSON.parse(event.data);
            if (!data) return;

            switch (data.type) {
              case EventType.UNITY_PLAYER_AFTER_PAY: {
                unityInstance.current?.SendMessage?.(NEXT_STRIPE_LISTENER, 'OnMessage', event.data);
                return;
              }
              case EventType.UNITY_PLAYER_VERIFF: {
                veriffContext?.SetUrl?.(data.payload.url);
                veriffContext?.Launch?.();
                return
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
        };
        // const worker = new window.SharedWorker('/worker.js');
        // worker.port.addEventListener("message", onMessage)
        window.addEventListener("message", onMessage);
      });

      return () => {
        if (!unityInstance.current?.removeTimeout) return;
        clearTimeout(unityInstance.current.removeTimeout as number);
      }
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Mobile device style: fill the whole browser client area with the game canvas:

      var meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
      document.getElementsByTagName('head')[0].appendChild(meta);
      ref.current.className = "unity-mobile";

      // To lower canvas resolution on mobile devices to gain some
      // performance, uncomment the following line:
      // config.devicePixelRatio = 1;

      setBanner({ message: 'WebGL builds are not supported on mobile devices.', type: 'warning'});
    } else {
      // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

      ref.current.style.width = "960px";
      ref.current.style.height = "600px";
    }
  }, [])

  return (
    <UnityAppContext.Provider value={unityInstance}>
      <script src={`${metadata.other.buildDirectory}/${metadata.other.loaderFilename}`} async={true}></script>
      <canvas id={`${config.productName}`} ref={ref} key={`${config.productName}`} width={config.width} height={config.height} style={{ backgroundColor: `${config.backgroundColor || '#ffffff'}` }}></canvas>
      {loading ? (
        <Loader />
      ) : null}
      {banner ? (
        <Banner message={banner.message} type={banner.type} />
      ) : null}
      {children}
      <button onClick={onFullScreen}></button>
    </UnityAppContext.Provider>
  );
}
