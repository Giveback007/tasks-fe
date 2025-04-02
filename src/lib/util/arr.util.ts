export function arrMoveItem<T>(arr: T[], fromIdx: number, toIdx: number) {
    arr = [...arr];

    let item = arr[fromIdx];
    arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, item);

    return arr;
}