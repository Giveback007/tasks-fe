import { writable } from "svelte/store";
import { debounceById } from "./utils.util";
import { browser } from "$app/environment";

export const lsAppId = `Shared-Tasks-V1`

function storageFactory(type: 'localStorage' | 'sessionStorage') {
    return {
        hasStore: () => !!(typeof window !== "undefined" && window[type]),
        get: <T = any>(key: str) => JSON.parse(window[type].getItem(key) ?? 'null') as T | null,
        set: (key: str, data: any) => window[type].setItem(key, JSON.stringify(data)),
        del: (key: str) => window[type].removeItem(key),
    }
}

export const lStore = storageFactory('localStorage');
export const sStore = storageFactory('sessionStorage');

const lsWritableKeys = new Set<str>();
export function lsWritable<T>(initState: T, id: str) {
    // if (lsWritableKeys.has(id)) throw `This LS id is already in use: "${id}"`;
    if (!browser || !lStore.hasStore()) return writable<T>(initState);

    const lsKeyId = `${lsAppId}__[${id}]`;
    const lsState = lStore.get(lsKeyId);
    const state = (lsState === '__null__' ? null : lsState || initState) as T;

    const wr = writable<T>(state);
    wr.subscribe(s => debounceById(() =>
        lStore.set(lsKeyId, s === null ? '__null__' : s), 50, lsKeyId));

    addEventListener("storage", ({ key, newValue: x }) => key === lsKeyId && debounceById(() => {
        console.log(key, x)
        if (x === null) throw 'newValue should not be: null';
        if (x === '__null__') return wr.set(null as T);

        wr.set(JSON.parse(x));
    }, 50, lsKeyId + '#'));

    lsWritableKeys.add(id);
    return wr;
}