<script lang="ts">
    import { updItem, type _List } from '$lib/store/store';
    import { useSortable } from '$lib/util/sortable.util.svelte';
    import { uuid } from '$lib/util/utils.util';
    import { onMount } from 'svelte';

    function addItem(text: string) {
        if (!text.trim()) return;
        updItem({
            t: 'T',
            id: uuid(),
            txt: text,
            done: false,
            listId: list.id
        });

        newItemText = "";
    }

    function editItem(x: Task) {
        updItem({...x, txt: taskEditTxt});
        taskEditId = null;
        taskEditTxt = '';
    }

    let {
        list
    } : {
        list: _List
    } = $props();

    let newItemText = $state("");
    let listElm = $state<HTMLUListElement | null>(null);
    let taskEditId: null | str = $state(null);
    let taskEditTxt: str = $state('');
    let taskDelId: null | str = $state(null);
    let taskDelWait = $state(false);

    useSortable(() => listElm, {
        animation: 200,
        handle: '.sort-handle',
        ghostClass: 'opacity-40',
        group: {
            name: 'Shared Lists',
            put: true,
        },
        onEnd(e) {
            // items = reorder(items, e)
        }
    });

    onMount(() => {

    })
</script>

<div class="p-3.5 shadow-md bg-gray-800">
    <!-- <strong class="font-bold pl-1">My Checklist</strong> -->

    <div class="mt-2 mb-0.5">
        <div class="flex">
            <!-- svelte-ignore a11y_no_redundant_roles -->
            <fieldset role="group" style="margin-bottom: 0.5rem;">
                <textarea
                    bind:value={newItemText}
                    placeholder="Add new item..."
                    style="min-height: 2em;"
                    onkeydown={e => e.key === 'Enter' && e.ctrlKey && addItem(newItemText)}
                ></textarea>
                <button
                    onclick={() => addItem(newItemText)}
                    aria-label="add"
                    style="padding: 0 0.75rem"
                    disabled={!newItemText.length}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.5em] inline-block">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            </fieldset>
        </div>
    </div>

    <ul bind:this={listElm} style="margin: 0;">
        {#each list.tasks as item (item)}
            <li
                class="flex items-center pl-2 border border-gray-200 rounded-md transition duration-200"
            >
                <div class="sort-handle flex items-center mr-2 hover:cursor-move">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="size-[1em] inline-block">
                        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                </div>
                <input
                    type="checkbox"
                    style="margin: auto; height: 1.45rem; width: 1.45rem;"
                    checked={item.done}
                    onchange={() => updItem({ id: item.id, done: !item.done })}
                />
                <span class="ml-3 flex-grow {item.done ? 'line-through text-gray-500' : ''}" >
                    {#if item.id === taskEditId}
                    <!-- svelte-ignore a11y_no_redundant_roles -->
                    <fieldset role="group" style="margin-bottom: 0.5rem;">
                        <textarea
                            bind:value={taskEditTxt}
                            placeholder="Add new item..."
                            style="min-height: 4.5em; padding: 0;"
                            onkeydown={e => e.key === 'Enter' && e.ctrlKey && editItem(item)}
                        ></textarea>
                        <button
                            onclick={() => editItem(item)}
                            aria-label="add"
                            style="padding: 0 0.75rem"
                            disabled={!taskEditTxt.length}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.5em] inline-block">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </fieldset>
                    {:else}
                    <div class="flex justify-between">
                        <span class="my-auto whitespace-pre-line py-1.5">{item.txt}</span>

                        {#if taskDelId === item.id}
                        <button
                            style="min-height: 100%; padding: 0.25rem 0.75rem; border-radius: 0 0.35rem 0.35rem 0; background-color: var(--color-red-600)"
                            aria-label="delete-task"
                            disabled={taskDelWait}
                            onclick={() => updItem(item, 'del')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.25em] inline-block">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                        {:else}
                        <details class="dropdown" style="margin: 0;">
                            <!-- svelte-ignore a11y_no_redundant_roles -->
                            <summary role="button" class="flex secondary" style="height: 100%; padding: 0.25rem 0.75rem; border-radius: 0 0.35rem 0.35rem 0;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.25em] inline-block m-auto">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </summary>
                            <ul class="z-10">
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                <li
                                    class="cursor-pointer hover:opacity-85 active:opacity-50"
                                    onclick={() => {
                                        taskEditId = item.id
                                        taskEditTxt = item.txt;
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.5em] inline-block">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </li>
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                <li
                                    class="cursor-pointer hover:opacity-85 active:opacity-50"
                                    onclick={() => {
                                        taskDelId = item.id;
                                        taskDelWait = true;
                                        setTimeout(() => taskDelId === item.id && (taskDelWait = false), 800)
                                        setTimeout(() => taskDelId === item.id && (taskDelId = null), 3000)
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.5em] inline-block">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </li>
                            </ul>
                        </details>
                        {/if}
                    </div>
                    {/if}
                </span>
            </li>
        {/each}
    </ul>
</div>

<style>
    summary::after {
        display: none !important;
    }
</style>