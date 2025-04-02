import Sortable from 'sortablejs';

export const useSortable = (
    getter: () => HTMLElement | null,
    options?: Sortable.Options
) => {
    $effect(() => {
        const sortableEl = getter();
        const sortable = sortableEl ?
            Sortable.create(sortableEl, options)
            : null;
        return () => sortable?.destroy();
    });
}

export function reorder<T>(
    array: T[],
    evt: Sortable.SortableEvent
): $state.Snapshot<T>[] {

    // should have no effect on stores or regular array
    const workArray = $state.snapshot(array);

    // get changes
    const { oldIndex: oldIdx, newIndex: newIdx } = evt;

    if (
        oldIdx === undefined
        ||
        newIdx === undefined
        ||
        newIdx === oldIdx
    ) return workArray;

    // move elements
    const target = workArray[oldIdx];
    const increment = newIdx < oldIdx ? -1 : 1;

    for (let k = oldIdx; k !== newIdx; k += increment)
        workArray[k] = workArray[k + increment];

    workArray[newIdx] = target;
    return workArray;
}