import { lsWritable } from "$lib/util/store.util";
import { debounceById, formatTime } from "$lib/util/utils.util";
import { writable } from "svelte/store";
import { updData } from "./store";

type _Time = {
    timeRemaining: str;
    prc: num;
}

export const data = lsWritable<DataDict>({}, 'data-dict');
data.subscribe(dict => debounceById(() => updData(dict), 0, 'sub-data-dict'));

export const initTimer: Timer = {
    id: 'TIMER',
    t: 'timer',
    time: 0,
    focus: 30 * 60 * 1000,
    rest: 5 * 60 * 1000,
    start: Date.now(),
    state: 'PAUSE',
}

export const timer = lsWritable<Timer>(initTimer, 'TIMER');
export const _time = writable<_Time>({
    timeRemaining: '00:00',
    prc: 0,
});

let itv: number = 0;
timer.subscribe((x) => {
    let t = {} as _Time;
    const unSub = _time.subscribe(_t => t = _t);
    unSub();

    clearInterval(itv);
    const fns: { [K in Timer['state']]: () => any } = {
        FOCUS: () => {
            t.timeRemaining = formatTime(x.start - Date.now() + x.focus);
            t.prc = (Date.now() - x.start) / x.focus * 100;
            if (t.prc >= 100) {
                t.prc = 100;
                t.timeRemaining = '00:00'
            }

            _time.set(t)
        },
        PAUSE: () => {
            t.timeRemaining = formatTime(Date.now() - x.start);
            t.prc = 100;

            _time.set(t)
        },
        REST: () => {
            t.timeRemaining = formatTime(x.start - Date.now() + x.rest);
            t.prc = (Date.now() - x.start) / x.rest * 100;
            if (t.prc >= 100) {
                t.prc = 100;
                t.timeRemaining = '00:00'
            }

            _time.set(t)
        }
    }

    itv = setInterval(fns[x.state], 333);
})