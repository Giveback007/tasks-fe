<script lang="ts">
    import { COLORS } from "$lib/consts";

    const {
        onClrSel,
        selClr = $bindable(),
    }: {
        onClrSel: (clr: typeof COLORS[num]) => any;
        selClr?: str;
    } = $props();

</script>

<details class="dropdown" style="margin: 0;">
    <summary style="padding: 0; height: auto;">
        <div class="{selClr || COLORS[0]} {selClr ? 'hover:opacity-50' : 'hover:bg-gray-600'} size-4.5 rounded-xs"></div>
    </summary>
    <ul style="margin: 0; transform: translateZ(0);">
        {#each COLORS as clr, i}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li
                class="{clr} min-w-10 min-h-6 hover:opacity-85 active:opacity-60 cursor-pointer"
                onclick={() => onClrSel(clr)}
            ></li>
        {/each}
    </ul>
</details>

<style>
    summary::after {
        display: none !important;
    }
</style>