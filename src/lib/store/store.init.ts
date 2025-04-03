import { debounceById } from "$lib/util/utils.util";
import { audio, data, playSound, timer } from "./data.store";
import { getData, updData } from "./store";

export function initStore() {
    let prevState = 'PAUSE' as Timer['state'];
    let prevTime = 0;
    timer.subscribe(x => {
        console.log(x.state);
        const _data = getData();

        if (prevTime === x.time) return;

        if (x.state !== prevState && x.state === 'PAUSE') {
            audio.pause();
        } else {
            playSound(x.sound_start, x.sound_startTimes);
        }

        prevTime = x.time;
        prevState = x.state;

        _data['TIMER'] = x;
        updData(_data)
    });

    data.subscribe(dict =>
        debounceById(() => updData(dict), 0, 'sub-data-dict'));

    delExpiredData();
}

function delExpiredData() {
    let d: DataDict = {};
    data.subscribe(x => d = {...x})();

    let didDelete = false;
    Object.values(d).forEach(({ id, time, del }) => {
        // Permanently delete items that were deleted more than 2 days ago
        if (del && Date.now() - time > 1000 * 60 * 60 * 24 * 2) didDelete = delete d[id];
    })

    if (didDelete) data.set(d)
}