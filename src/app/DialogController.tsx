import { Dispatch, FC, ReactNode, SetStateAction, createContext, createRef, useCallback, useRef, useState } from "react";


export interface DialogProps {
  isOpen?: boolean;
  toggleDialog?: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
  url?: string;
  openDialog?: (url: string, callback?: (this: HTMLIFrameElement, ev: Event) => any) => void;
}

export const DialogContext = createContext<DialogProps>({
  openDialog: (url: string, callback) => {}
});

const toggle = (state: boolean) => !state;

export const DialogController: FC<DialogProps> = (props) => {
  const { children } = props;
  const ref = createRef<HTMLIFrameElement>();
  const [isOpen, setOpen] = useState(props.isOpen ?? false);
  const [url, setUrl] = useState(props.url ?? '');
  const toggleDialog = setOpen.bind(toggle);

  const openDialog = (newUrl: string, callback?: (this: HTMLIFrameElement, ev: Event) => any) => {
    if (url !== newUrl) setUrl(newUrl);
    if (ref.current && callback) ref.current.addEventListener('load', callback);
    setOpen(true);
  }

  return (
    <>
      <DialogContext.Provider value={{ isOpen, toggleDialog, openDialog }}>
        {children}
      </DialogContext.Provider>
      <dialog open={isOpen} style={{ width: 400, height: 500 }}>
        <iframe src={url} ref={ref}></iframe>
      </dialog>
    </>
  )
}