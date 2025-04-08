type _Base = {
    id: str;
    idx?: num;
    /** Last update time of obj */
    time: num;
    del?: bol;
}

type Timer = _Base & {
    id: 'TIMER';
    t: 'timer';
    start: num;
    focus: num;
    rest: num;
    state: 'FOCUS' | 'REST' | 'PAUSE';
    sound_start: str;
    sound_startTimes: num;
    sound_end: str;
    sound_endTimes: num;
}

type Task = _Base & {
    t: 'T';
    txt: str;
    done: bol;
    listId: str;
    clr?: str;
};

type List = _Base & {
    t: 'L';
    name: str;
    groupId: str;
    clr?: str;
};

type Group = _Base & {
    t: 'G';
    name: str;
}

type AllData = Task | List | Group | Timer;
type DataDict = Dict<AllData>;

type Theme = 'dark' | 'light';