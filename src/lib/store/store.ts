import { lsWritable } from "$lib/util/store.util";
import { debounceById } from "$lib/util/utils.util";
import { writable } from "svelte/store";

export const listIsOpen = lsWritable<Dict<bol>>({}, 'listIsOpen')

type DataDict = Dict<Task | List | Group>;
export const data = lsWritable<DataDict>({}, 'data-dict');
data.subscribe(dict => debounceById(() => updData(dict), 0, 'sub-data-dict'));

export const groups = writable<_Group[]>([]);
export const lists = writable<Dict<_List>>({});
// export const tasks = writable<Dict<Task>>({});

export type _Group = Group & { lists: _List[]; nDone: num; nTasks: num; };
export type _List = List & { tasks: Task[]; nDone: num; nTasks: num; };

type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export function updItem(
    x: PartialExcept<Task | List | Group, 'id'>,
    act: 'del' | 'upd' = 'upd', doSet = true
) {
    if (act === 'del') {
        delete _data[x.id];
    } else {
        (_data as any)[x.id] = { ..._data[x.id], ...x }
    }

    // log(JSON.parse(JSON.stringify(_data)))
    if (doSet) data.set(_data);
};

export function updMulti(
    arr: ['del' | 'upd', PartialExcept<Task | List | Group, 'id'>][]
) {
    arr.forEach(([act, data]) => updItem(data, act, false));
    data.set(_data);
}

export const getData = () => _data;

let _data: DataDict = {};
function updData(dict: DataDict) {
    console.log('--- UPDATE ---', JSON.parse(JSON.stringify(dict)));
    _data = dict;

    const t = new Map<str, Task>();
    const l = new Map<str, _List>();
    const g = new Map<str, _Group>();

    for (let id in dict) {
        const x = dict[id];
        switch (x.t) {
            case 'T':
                t.set(x.id, x);
                break;
            case 'L':
                l.set(x.id, {...x, tasks: [], nTasks: 0, nDone: 0 });
                break;
            case 'G':
                g.set(x.id, {...x, lists: [], nTasks: 0, nDone: 0 });
                break;
        }
    }

    const updates: ['del' | 'upd', (Task | List | Group)][] = [];

    t.forEach(x => {
        const list = l.get(x.listId);
        if (!list) return updates.push(['del', x]);

        list.tasks.push(x);
    });

    const n = (x: num | undefined) => x as num > -1 ? x as num : Infinity;

    l.forEach(x => {
        const group = g.get(x.groupId);
        if (!group) return updates.push(['del', x]);

        x.tasks = x.tasks.sort((a, b) => (a.idx || 9999) - (b.idx || 9999));
        x.nTasks = x.tasks.length
        x.nDone = x.tasks.filter(x => x.done).length;

        group.lists.push(x);
    });

    let updateData: _Group[] = [];

    g.forEach(x => {
        x.lists = x.lists.sort((a, b) => n(a.idx) - n(b.idx));
        x.lists.forEach((l, i) => {
            x.nTasks += l.nTasks;
            x.nDone += l.nDone;

            if (l.idx !== i) updates.push(['upd', {...l, idx: i}])
        });

        updateData.push(x);
    });

    updateData = updateData.sort((a, b) => n(a.idx) - n(b.idx));
    updateData.forEach((x, i) => x.idx !== i && updates.push(['upd', {...x, idx: i}]));

    if (updates.length)
        updMulti(updates);
    else {
        groups.set(updateData);
    }
}