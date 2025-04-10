<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { ClassValue, MouseEventHandler } from 'svelte/elements';

    let {
        children,
        ...rest
    }: {
        children: Snippet;
        onclick?: MouseEventHandler<HTMLButtonElement> | undefined | null;
        class?: ClassValue | undefined | null;
    } = $props();
</script>

<button
    style="padding: 0.25rem 0.5rem;"
    {...rest}
>
    {@render children()}
</button>