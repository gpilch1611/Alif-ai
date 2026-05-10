declare global {
  interface Navigator {
    standalone?: boolean;
  }

  interface Window {
    __alifReloading?: boolean;
    webkitSpeechRecognition?: any;
  }

  interface DeviceOrientationEventConstructor {
    requestPermission?: () => Promise<"granted" | "denied" | "default">;
  }

  var DeviceOrientationEvent: DeviceOrientationEventConstructor;
}

declare module "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs" {
  export const GlobalWorkerOptions: { workerSrc: string };
  export function getDocument(source: ArrayBuffer | Uint8Array | string): { promise: Promise<unknown> };
}

export {};
