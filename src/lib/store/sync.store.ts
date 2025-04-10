import { PUBLIC_WS } from "$env/static/public";
import { debounceById } from "$lib/util/utils.util";
import { data } from "./data.store";
import { updData } from "./store";

let serverDict: DataDict = {};
let localDict: DataDict = {};

function syncDict(ws: WebSocket, type: 'send' | 'receive') {
    const newDict: DataDict = {};
    let updates: (AllData)[] = [];

    const allIds = new Set([
        ...Object.values(serverDict),
        ...Object.values(localDict),
    ].map(x => x.id));


    allIds.forEach(id => {
        const o1 = localDict[id] || { time: 0 } as AllData;
        const o2 = serverDict[id] || { time: 0 } as AllData;
        const o = o2.time > o1.time ? o2 : o1;

        if (!o.id) return;

        newDict[o.id] = o;
        if (o2.time !== o1.time) updates.push(o);
    });

    if (updates.length) {
        // Trying to fix the Firefox bug for data sync (it's not working)
        const t1 = localDict['TIMER'] || null as Timer | null;
        const t2 = serverDict['TIMER'] || null as Timer | null;
        if (t1 && t2) newDict['TIMER'] = t2.time > t1.time ? t2 : t1;
        else if (t1 || t2) newDict['TIMER'] = t1 || t2;

        if (type === 'send')
            ws.send(JSON.stringify(newDict));

        if (type === 'receive')
            updData({...localDict, ...newDict})
    }
}

let ws: WebSocket
function connectWS() {
    if (ws && !(ws.readyState === ws.CLOSED)) return;

    ws = new WebSocket(PUBLIC_WS);
    let unSub: null | (() => any) = null;

    ws.onopen = () => unSub = data.subscribe(dict => {
        localDict = dict;
        debounceById(() => syncDict(ws, 'send'), 0, 'ws-data-dict')
    });;

    ws.onmessage = (ev) => {
        serverDict = {...serverDict, ...JSON.parse(ev.data)};
        syncDict(ws, 'receive');
    };

    ws.onclose = () => unSub?.();
}

export function initStoreSync() {
    connectWS();
    setInterval(connectWS, 2500)
};
