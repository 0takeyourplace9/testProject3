import type { FC, ReactNode } from 'react';
import { createContext, useEffect } from 'react';
import * as Veriff from './veriff.js';

const StorageIds =
{
    SessionUrl: "veriff_session_url",
    Language: "veriff_lang"
}
var veriffFrame;

export function SetUnityPlayer(value: any) {
  // @ts-ignore
  if(!window.Veriff) return;
  // @ts-ignore
  window.Veriff.UnityPlayer = value;
}

function SetUrl(url: string) {
    sessionStorage.setItem(StorageIds.SessionUrl, url);
}

function SetLanguage(language: string) {
  sessionStorage.setItem(StorageIds.Language, language);
}
function Launch() {
    var params =
    {
        url: sessionStorage.getItem(StorageIds.SessionUrl),
        lang: sessionStorage.getItem(StorageIds.Language),
        onEvent: ResultListener,
        onReload: () => {
            window.location.reload();
        },
    };
    veriffFrame = Veriff.createVeriffFrame(params);
}

function ResultListener(message: any) {
// @ts-ignore
if (!window.Veriff) return;
  // @ts-ignore
  var unityPlayer = window.Veriff.UnityPlayer;
  if (unityPlayer === null) { return; }
  switch (message) {
    case Veriff.MESSAGES.STARTED:
      unityPlayer.SendMessage('Veriff', 'VeriffStarted', "");
      break;
    case Veriff.MESSAGES.FINISHED:
      unityPlayer.SendMessage('Veriff', 'VeriffDone', "");
      break;
    case Veriff.MESSAGES.CANCELED:
      unityPlayer.SendMessage('Veriff', 'VeriffCanceled', "");
      break;
  }
}
export interface VeriffControllerProps {
  children?: ReactNode;
  SetUnityPlayer?: (value: unknown) => void;
  Launch?: () => void;
  SetUrl?: (url: string) => void;
}

export const VeriffContext = createContext<VeriffControllerProps | undefined>(undefined);

export const VeriffController: FC<VeriffControllerProps> = (props) => {
  const { children } = props;

  useEffect(() => {
    // @ts-ignore
    window.Veriff = window.Veriff || {
      UnityPlayer: null,
      SetUrl: null,
      SetLanguage: null,
      Launch: null
    }
    // @ts-ignore
    window.Veriff.SetUrl = SetUrl;
    // @ts-ignore
    window.Veriff.SetLanguage = SetLanguage;
    // @ts-ignore
    window.Veriff.Launch = Launch;
  }, []);

  return (
    <VeriffContext.Provider value={{ ...props, SetUnityPlayer, SetUrl, Launch }}>
      {children}
    </VeriffContext.Provider>
  )
};