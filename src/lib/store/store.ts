import { lsWritable } from "$lib/util/store.util";
import { writable } from "svelte/store";
import { data, initTimer, timer } from "./data.store";
import { debounceById } from "$lib/util/utils.util";

export const listIsOpen = lsWritable<Dict<bol>>({}, 'listIsOpen');

export const groups = writable<_Group[]>([]);
export const lists = writable<Dict<_List>>({});
export const tasks = writable<Dict<Task>>({});


export type _Group = Group & { lists: _List[]; nDone: num; nTasks: num; };
export type _List = List & { tasks: Task[]; nDone: num; nTasks: num; };

type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export function updItem(
    x: PartialExcept<AllData, 'id'>,
    act: 'del' | 'upd' = 'upd',
    doSet = true
) {
    const o = {
        ..._data[x.id],
        ...x,
        time: Date.now()
    }

    if (act === 'del') o.del = true;

    (_data as any)[x.id] = o;
    if (doSet) debounceById(() => data.set(_data), 0, 'updItem')
};

export function updMulti(
    arr: ['del' | 'upd', PartialExcept<Task | List | Group, 'id'>][]
) {
    arr.forEach(([act, data]) => updItem(data, act, false));
    updData(_data);
}

export const getData = () => _data;

let _data: DataDict = {};
export function updData(dict: DataDict) {
    _data = dict;
    console.log(
        '--- updData ---',
        // JSON.parse(JSON.stringify(dict))
    );

    const n = (x: num | undefined) => x as num > -1 ? x as num : Infinity;
    const updates: ['del' | 'upd', (Task | List | Group)][] = [];

    const u = {
        tasks: {} as Dict<Task>,
        lists: {} as Dict<_List>,
        groups: {} as Dict<_Group>,
        timer: { ...initTimer, ...dict['TIMER'] } as Timer,
    }

    for (let id in dict) {
        const x = dict[id];
        switch (x.t) {
            case 'T':
                u.tasks[x.id] = x;
                break;
            case 'L':
                u.lists[x.id] = {...x, tasks: [], nTasks: 0, nDone: 0 };
                break;
            case 'G':
                u.groups[x.id] = {...x, lists: [], nTasks: 0, nDone: 0 }
                break;
        }
    }


    Object.values(u.tasks).map(t => {
        const list = u.lists[t.listId];
        if (!list || list.del && !t.del) return updates.push(['del', t]);

        list.tasks.push(t);
    });

    Object.values(u.lists).map(l => {
        const group = u.groups[l.groupId];
        if (!group || group.del && !l.del) return updates.push(['del', l]);

        l.tasks = l.tasks
            .filter(t => !t.del)
            .sort((a, b) => n(a.idx) - n(b.idx));

        l.nTasks = l.tasks.length
        l.nDone = l.tasks.filter(x => x.done).length;

        l.tasks.forEach((t, i) =>
            t.idx !== i && updates.push(['upd', {...t, idx: i}]))

        group.lists.push(l);
    });

    Object.values(u.groups).map(g => {
        g.lists = g.lists
            .filter(l => !l.del)
            .sort((a, b) => n(a.idx) - n(b.idx));

        g.lists.forEach((l, i) => {
            g.nTasks += l.nTasks;
            g.nDone += l.nDone;

            if (l.idx !== i) updates.push(['upd', {...l, idx: i}])
        });
    });

    const groupArr = Object.values(u.groups)
        .filter(g => !g.del)
        .sort((a, b) => n(a.idx) - n(b.idx));

    groupArr.forEach((x, i) => x.idx !== i && updates.push(['upd', {...x, idx: i}]));

    if (updates.length) {
        updMulti(updates);
    } else {
        groups.set(groupArr);
        lists.set(u.lists);
        tasks.set(u.tasks);
        timer.set(u.timer);
    }
}