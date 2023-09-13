'use client'

import type { FC, MouseEventHandler, MutableRefObject } from "react";
import { useContext } from "react";
import { UnityInstance } from "./types.d";
import { UnityAppContext } from "./app";

export interface UnityButtonProps {
  children?: React.ReactNode;
}

export const UnityButton:FC<UnityButtonProps> = (props) => {
  const { children } = props;
  const unityInstance = useContext<MutableRefObject<UnityInstance | undefined>>(UnityAppContext);

  const handleClick:MouseEventHandler<HTMLButtonElement> = () => {
    unityInstance?.current?.SendMessage?.('player1(Clone)', 'OnMessage', "{ \"type\": \"UNITY\", \"payload\": { \"kind\": \"PLAYER_SHOOT\", \"message\": \"Player shoot the bullet with button\" } }");
  };

  return (
    <button onClick={handleClick}
      className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700/80"
      aria-label="Fire"
    >
      {children}
    </button>
  );
}