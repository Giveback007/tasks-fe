type Task = {
    t: 'T';
    id: str;
    txt: str;
    done: bol;
    listId: str;
    idx?: num;
};

type List = {
    t: 'L';
    id: str;
    name: str;
    groupId: str;
    idx?: num;
};

type Group = {
    t: 'G';
    id: str;
    name: str;
    idx?: num;
}