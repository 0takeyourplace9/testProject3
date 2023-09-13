type IntegerString = string; // `${number}`;
type BooleanString = string; // `${boolean}`;

export interface UnityConfig extends Record<string, unknown> {
  companyName?: String; // The Company Name defined in the Player Settings.
  productName?: String; // The Product Name defined in the Player Settings.
  productVersion?: String; // The Version defined in the Player Settings.
  width?: IntegerString; // The Default Canvas Width defined in the Player Settings > Resolution and Presentation.
  height?: IntegerString; // The Default Canvas Height in the Player Settings > Resolution and Presentation.
  splashScreenStyle?: String; // This's set to the "Dark" value when Splash Style Player Settings > Splash Image is set to Light on Dark, otherwise it's set to the "Light" value.
  backgroundColor?: String; // Represents the Background Color defined in a form of a hex triplet.
  unityVersion?: String; // The Unity version.
  developmentPlayer?: BooleanString; // This's set to true if the Development Build option is enabled.
  decompressionFallback?: String; // This's set to Gzip or Brotli, depending on the compression method you use and the type of decompressor included in the build. If neither is included, the variable is set to an empty string.
  initialMemory?: IntegerString; // The initial size of the WASM memory heap in megabytes (MB).
  useWasm?: BooleanString; // This is set to true if the current build is a WebAssembly build.
  useThreads?: BooleanString; // This is set to true if the current build uses threads.
  useWebGl10?: BooleanString; // This is set to true if the current build supports the WebGL1.0 graphics API.
  useWebGl20?: BooleanString; // This is set to true if the current build supports the WebGL2.0 graphics API.
  useDataCaching?: BooleanString; // This is set to true if the current build uses indexedDB caching for the downloaded files.
  loaderFilename?: String; // This is set to the filename of the build loader script.
  dataFilename?: String; // This is set to the filename of the main data file.
  frameworkFilename?: String; // This is set to the filename of the build framework script.
  codeFilename?: String; // This is set to the filename of the WebAssembly module when the current build is a WebAssembly build, otherwise it's set to the filename of the asm.js module.
  memoryFilename?: String; // This is set to the filename of the memory file when memory is stored in an external file, otherwise it's set to an empty string.
  symbolsFilename?: String; // This is set to the filename of the JSON file containing debug symbols when the current build is using debug symbols, otherwise it's set to an empty string.
  backgroundFilename?: String; // This is set to the filename of the background image when the background image is selected in the Player Settings > Splash Image, otherwise it's set to an empty string.
}

interface UnityInstance extends Record<string, unknown> {
  SendMessage?: (objectName: string, methodName: string, args: string) => void;
  onMessage?: (objectName: string, methodName: string, args: string) => void;
  SetFullscreen?: (fullscreen: boolean) => void;
}

export interface PaymentProps {
  children?: React.ReactNode;
  price?: string;
  customerID?: string;
  clientSecret?: string;
  paymentMethodID?: string;
  message?: string;
  paymentSessionID?: string;
  paymentStatus?: string;
  paymentMessage?: string;
}

export enum EventType {
  UNITY_PLAYER_PAY = 'UNITY_PLAYER_PAY',
  UNITY_PLAYER_AFTER_PAY = 'UNITY_PLAYER_AFTER_PAY',
  UNITY_PLAYER_VERIFF = 'UNITY_PLAYER_VERIFF',
  PING = 'PING',
}

export enum PaymentStatus_unsafe {
  SUCCESS = 'success',
  CANCELED = 'canceled',
}
export interface PaymentData {
  hash?: string;
  customerID: string | undefined;
  message?: string;
  price?: string;
  sessionID?: string;
  status?: string;
}

export interface  ReduxEvent<T, D> {
  type: T;
  payload: D;
}

export type ReduxAction = () => ReduxEvent;

export type Reducer<T extends {}, D = ReduxEvent > = (a: T, b: D) => a;

export interface Error {
  message?: string;
  code?: number;
}

export interface Veriff {
  UnityPlayer: UnityInstance | undefined;
  SetUrl: (url: string) => void;
  SetLanguage: (lang: string) => void;
  Launch: () => void;
}
declare global {
  createUnityInstance: (canvas: HTMLCanvasElement, config: UnityConfig) => Promise<UnityInstance>;
  unityInstance: UnityInstance | undefined;
  Service: () => Worker | undefined;
  Veriff: Veriff | undefined;
}
