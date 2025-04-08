/// <reference types="vite/client" />

declare module 'virtual:pwa-info' {
    import type { PwaInfo } from '@vite-pwa/sveltekit';
    export const pwaInfo: PwaInfo | undefined;
}

declare module 'virtual:pwa-register' {
    import type { RegisterSWOptions } from 'vite-plugin-pwa/types';
    export const useRegisterSW: (options?: RegisterSWOptions) => {
        needRefresh: import('svelte/store').Readable<boolean>;
        offlineReady: import('svelte/store').Readable<boolean>;
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
    };
}

declare module 'virtual:pwa-assets/head' {
    export const pwaAssetsHead: {
        themeColor?: { content: string };
        links: Array<{ rel: string; href: string; sizes?: string; type?: string }>;
    };
}