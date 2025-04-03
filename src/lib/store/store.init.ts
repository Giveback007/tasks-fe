import { debounceById } from "$lib/util/utils.util";
import { data, timer } from "./data.store";
import { getData, updData } from "./store";

export function initStore() {
    timer.subscribe(x => {
        const _data = getData();

        if (_data['TIMER']?.time === x.time) return;
        console.log(x)

        _data['TIMER'] = x;
        updData(_data);
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