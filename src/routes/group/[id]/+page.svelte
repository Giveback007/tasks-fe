<script lang="ts">
    import Checklist from "$lib/components/Checklist.comp.svelte";
    import ColorsSel from "$lib/components/ColorsSel.comp.svelte";
    import Tabs from "$lib/components/Tabs.comp.svelte";
    import { getData, groups, listIsOpen, updItem, type _List } from "$lib/store/store";
    import { useSortable } from "$lib/util/sortable.util.svelte";
    import { uuid } from "$lib/util/utils.util";
    import type { PageData } from "./$types";

    const {
        data: pageData
    }: {
        data: PageData
    } = $props();

    let delModal: null | _List = $state(null);
    let editModal: null | _List = $state(null);
    let newName = $state('');

    const list = {
        add: () => updItem({
            t: 'L',
            id: uuid(),
            name: group!.name + '-List-' + (group!.lists.length + 1),
            groupId: group!.id,
        }),
        upd: () => {
            if (!editModal) return;

            const obj = {...editModal, name: newName} as List;
            delete (obj as any)['tasks'];

            updItem(obj);
            editModal = null;
        },
        del: () => {
            if (!delModal) return;
            updItem({ id: delModal.id }, 'del');
            delModal = null;
        }
    } as const;

    const group = $derived($groups.find(x => x.id === pageData.id) || null);
    const lists = $derived(group?.lists || []);
    let selTab: 'lists' | 'tasks' = $state('tasks');

    let tableElm = $state<HTMLTableSectionElement | null>(null);
    let inputElm = $state<HTMLInputElement | null>(null);

    useSortable(() => tableElm, {
        handle: '.sort-handle',
        ghostClass: 'opacity-40',
        onEnd(e) {
            const id = e.item.attributes.getNamedItem('data-id')?.value;
            if (!id) return;

            let i = (e.newIndex || 0)
                + (e.oldIndex! > e.newIndex! ? -0.5 : 0.5);

            updItem({
                ...getData()[id],
                idx: i,
            })
        }
    });
</script>

{#if group}
<Tabs
    tabs={[['Lists', 'lists'], ['Tasks', 'tasks']]}
    bind:selId={selTab}
/>
<hr />
{:else}
<h1>No Group Found</h1>
{/if}

{#if group && selTab === 'tasks'}
    {#each lists as list}
        {@const prc = Math.round(list.nDone / list.nTasks * 100)}
        <details
            bind:open={$listIsOpen[list.id]}
            name={list.name}
            style="margin: 0.25rem;"
        >
            <!-- svelte-ignore a11y_no_redundant_roles -->
            <summary role="button" style="margin: 0; border-radius: 0;" class="flex">
                <div class="flex flex-1">
                    <div class="{list.clr} size-6 mr-2 my-auto rounded-md"></div>
                    <div class="align-middle my-auto pt-0.5">
                        <strong>{list.name}:</strong>
                        {list.nDone}/{list.tasks.length}
                        {prc > -1 ? prc : 100}%
                    </div>
                </div>
            </summary>
            <Checklist list={list} />
        </details>
    {/each}
{/if}

{#if group && selTab === 'lists'}
<div class="ml-2">
    <button onclick={list.add}>
        Create New List
    </button>
</div>
<div class="overflow-auto min-h-96">
    <table>
        <thead>
            <tr>
                <th class="w-4"></th>
                <!-- <th></th> -->
                <th>Group</th>
                <th>Tasks</th>
                <th>%</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody bind:this={tableElm}>
        {#each lists as list (list)}
            {@const prc = Math.round(list.nDone / list.nTasks * 100)}
            <tr data-id={list.id}>
                <td style="padding-right: 0;">
                    <div class="flex">
                        <div class="hover:cursor-move sort-handle m-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="size-5">
                                <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                            </svg>
                        </div>
                        <div class="m-auto">
                            <ColorsSel
                                onClrSel={(clr) => updItem({...list, clr })}
                                selClr={list.clr}
                            />
                        </div>
                    </div>
                </td>
                <th>{list.name}</th>
                <td class="w-24">{list.nDone} / {list.nTasks}</td>
                <td class="w-6">{prc > -1 ? prc : 0}%</td>
                <td class="w-6" style="padding: 0 0.25rem;">
                    <button
                        aria-label="edit-group"
                        class="outline contrast"
                        style="padding: 0.35rem 0.5rem;"
                        onclick={() => {
                            editModal = list;
                            newName = list.name;
                            setTimeout(() => inputElm?.select());
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-[0.1em] size-[1.5em] inline-block">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                </td>
                <td class="w-6" style="padding: 0 0.25rem;">
                    <button
                        aria-label="edit-group"
                        class="outline contrast"
                        style="padding: 0.35rem 0.5rem;"
                        onclick={() => delModal = list}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
{/if}

{#if delModal}
<dialog open>
    <article>
        <h4>DELETE GROUP: <strong>"{delModal.name}"</strong>?</h4>
        <footer>
            <button
                class="secondary"
                onclick={() => delModal = null}
            >Cancel</button>
            <button
                onclick={list.del}
            >Confirm</button>
        </footer>
    </article>
</dialog>
{/if}

{#if editModal}
<dialog open>
    <article>
        <header class="flex justify-between">
            <p>
                Edit Group: <strong>{editModal.name}</strong>
            </p>
            <button
                class="secondary"
                style="padding: 0 0.45rem;"
                onclick={() => editModal = null}
            >X</button>
        </header>
        <!-- svelte-ignore a11y_no_redundant_roles -->
        <fieldset role="group">
            <input
                bind:value={newName}
                bind:this={inputElm}
                placeholder="Group Name"
                onkeydown={(e) => e.key === "Enter" && list.upd()}
            />
            <button
                onclick={list.upd}
                aria-label="add"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.5em] inline-block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </button>
        </fieldset>
    </article>
</dialog>
{/if}

<style>
    .overflow-auto {
        overflow: auto !important;
        @media (width >= 500px) {
            overflow: visible !important;
        }
    }
</style>