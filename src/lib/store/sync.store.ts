import { PUBLIC_WS } from "$env/static/public";
import { debounceById } from "$lib/util/utils.util";
import { data } from "./data.store";
import { updData } from "./store";

// const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

let serverDict: DataDict = {};
let localDict: DataDict = {};

function syncDict(ws: WebSocket, type: 'send' | 'receive') {
    const newDict: DataDict = {};
    let updates: (Task | List | Group | Timer)[] = [];

    const allIds = new Set([
        ...Object.values(serverDict),
        ...Object.values(localDict),
    ].map(x => x.id));

    allIds.forEach(id => {
        const o1 = localDict[id] || { time: 0 } as Task | List | Group;
        const o2 = serverDict[id] || { time: 0 } as Task | List | Group;
        const o = o2.time > o1.time ? o2 : o1;

        if (!o.id) return;

        newDict[o.id] = o;
        if (o2.time !== o1.time) updates.push(o);
    });

    if (updates.length) {
        if (type === 'send')
            ws.send(JSON.stringify(newDict));

        if (type === 'receive')
            updData({...localDict, ...newDict})
    }
}

export function initStoreSync() {
    const ws = new WebSocket(PUBLIC_WS);
    ws.addEventListener('open', () => {
        data.subscribe(dict => {
            localDict = dict;
            debounceById(() => syncDict(ws, 'send'), 0, 'ws-data-dict')
        });
    });

    ws.addEventListener('message', (event) => {
        serverDict = JSON.parse(event.data);
        syncDict(ws, 'receive');
    });
}