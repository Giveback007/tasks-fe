<script lang="ts">
    import { page } from "$app/state";
    import { TIMER_STATE_TITLES } from "$lib/consts";
    import { _time, nextTimer, timer } from "$lib/store/data.store";
    import { groups } from "$lib/store/store";

    let groupTabs: [str, str][] = $state([]);
    let selGroup: str = $state("");

    groups.subscribe(groups => {
        groupTabs = [];

        groups.map((x) => {
            let nTasks = 0;
            let nDone = 0;
            x.lists.map(l => {
                if (!l.fcs) return;
                nTasks += l.nTasks;
                nDone += l.nDone;
            })

            const prc = Math.round(nDone / nTasks * 100)
            groupTabs.push([`[${x.name} ${prc > -1 ? prc : 0}%]`, x.id])
        });
        selGroup = groups[0]?.id || "";
    });

    const selGroupId: str | null = $derived(page.route.id === "/group/[id]" ? page.data?.id || null : null);
</script>

<div>
    <nav class="px-4 sm:px-8 shadow-lg">
        <ul>
            <li>
                <strong class="flex items-center text-nowrap">
                    <button
                        class={$_time.mode ? "outline" : ""}
                        style="margin: 0; padding: 0.1rem 0.15rem;"
                        title={TIMER_STATE_TITLES[$timer.state]}
                        onclick={nextTimer}
                    >
                        {#if $timer.state === 'PAUSE'}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.5em] inline-block mb-[0.1em]">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
                            </svg>
                        {:else if $timer.state === 'REST'}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.5em] inline-block mb-[0.1em]">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                            </svg>
                        {:else}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-[1.5em] inline-block mb-[0.1em]">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        {/if}
                    </button><span class="
                        hover:bg-gray-300 active:bg-gray-200
                        ml-0.5 py-1 px-1.5 rounded-sm
                        dark:hover:bg-gray-800 dark:active:bg-gray-700
                    ">
                        <a
                            href="/"
                            class="time-count"
                            style="
                                text-decoration: none;
                                text-shadow: 0px 1px 0px rgb(0 0 0 / 0.075), 0px 1px 1px rgb(0 0 0 / 0.075), 0px 2px 2px rgb(0 0 0 / 0.075);
                            "
                        >{$_time.timeRemaining}</a>
                    </span>
                </strong>
            </li>
        </ul>


        <ul class="overflow-x-auto">
            {#each groupTabs as [name, id]}
            <li>
                <a
                    class="{selGroupId === id ? "secondary" : ""} text-nowrap"
                    aria-current={selGroupId === id ? "page" : null}
                    href={`/group/${id}`}
                >{name}</a>
            </li>
            {/each}

            <li>
                <a href="/settings" aria-label="settings" class="contrast">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-[1.5em] inline-block mb-[0.1em]"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                        />
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                    </svg>
                </a>
            </li>
        </ul>
    </nav>
    {#if $_time.mode && $timer.state !== 'PAUSE'}
        <progress value="{$_time.prc}" max="100" class="relative" style="border-radius: 0;"></progress>
    {:else}
        <progress value="0" max="100" class="relative" style="border-radius: 0;"></progress>
    {/if}
</div>

<style>
    :global(.dark) .time-count {
        color: white !important;
    }

    /* :global(.light) .time-count {
        color: black !important;
    } */
</style>
