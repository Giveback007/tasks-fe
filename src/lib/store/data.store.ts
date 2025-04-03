import { lsWritable } from "$lib/util/store.util";
import { debounceById, formatTime, wait } from "$lib/util/utils.util";
import { writable } from "svelte/store";
import { updData, updItem } from "./store";
import { AudioWrapper } from "$lib/util/audio.util";
import { browser } from "$app/environment";

type _Time = {
    timeRemaining: str;
    prc: num;
    mode: bol;
}

export const data = lsWritable<DataDict>({}, 'data-dict');

export const initTimer: Timer = {
    id: 'TIMER',
    t: 'timer',
    time: 0,
    focus: 30 * 60 * 1000,
    rest: 5 * 60 * 1000,
    start: Date.now(),
    state: 'PAUSE',
    sound_start: 'sounds/default.wav',
    sound_startTimes: 2,
    sound_end: 'sounds/default.wav',
    sound_endTimes: 2,
}

export const timer = lsWritable<Timer>(initTimer, 'TIMER');
export const _time = writable<_Time>({
    timeRemaining: '00:00',
    prc: 0,
    mode: true,
});

export let audio = (browser ? new AudioWrapper('sounds/default.wav') : {}) as AudioWrapper;

let soundId = 0;
export const playSound = async (
    sound: str,
    times: num,
    repeat?: num,
) => {
    audio.pause();
    const _soundId = soundId = Math.random();
    if (!sound) return soundId;

    audio.setAudio(sound)
    let count = times
    while (_soundId === soundId && count--) {
        await audio.play();

        if (!count && repeat) {
            await wait(repeat);
            count = times;
        } else {
            await wait(150);
        }
    };

    return soundId;
}

let timerDidEnd = false;
export const nextTimer = () => {
    timerDidEnd = false;

    let t = {} as Timer;
    timer.subscribe(_t => t = _t)();

    const nextState = ({
        FOCUS: 'REST',
        REST: 'PAUSE',
        PAUSE: 'FOCUS'
    } as const)[t.state];

    if (nextState === 'PAUSE') {
        audio.pause();
        soundId = 0;
    } else {
        playSound(t.sound_start, t.sound_startTimes);
    }

    updItem({
        ...t,
        start: Date.now(),
        state: nextState,
    })
}

let prevModeTime = 0;
let itv: number = 0;
const flashBtn = (t: _Time) => {
    if (prevModeTime > Date.now() - 1800) return;

    t.mode = !t.mode;
    prevModeTime = Date.now();
}

const updTime = (start: num, totalMs: num, t: _Time) => {
    let tmr = {} as Timer;
    timer.subscribe(_t => tmr = _t)();

    t.mode = true;
    t.prc = (Date.now() - start) / totalMs * 100;

    if (t.prc >= 100) {
        t.prc = 100;
        t.timeRemaining = '00:00'
        flashBtn(t);

        /* End Of Session Sound */
        if (!timerDidEnd) playSound(tmr.sound_end, tmr.sound_endTimes, 12_000)
        timerDidEnd = true;
    } else {
        t.timeRemaining = formatTime(start - Date.now() + totalMs + 1000);
    }

    _time.set(t);
}

timer.subscribe((x) => {
    let t = {} as _Time;
    const unSub = _time.subscribe(_t => t = _t);
    unSub();

    clearInterval(itv);
    const fns: { [K in Timer['state']]: () => any } = {
        FOCUS: () => updTime(x.start, x.focus, t),
        REST: () => updTime(x.start, x.rest, t),
        PAUSE: () => {
            flashBtn(t);

            t.timeRemaining = formatTime(Date.now() - x.start);
            t.prc = 100;

            _time.set(t)
        },
    }

    itv = setInterval(fns[x.state], 350) as any;
});
