<script lang="ts">
	import '@picocss/pico'
	import '../app.css';
    import Nav from "$lib/components/Nav.comp.svelte";
    import { onMount } from 'svelte';
    import { initStoreSync } from '$lib/store/sync.store';
    import { initStore } from '$lib/store/store.init';
	(globalThis as any).log = console.log;

	let { children } = $props();

	onMount(() => {
		initStore();
		initStoreSync()
	})
</script>

<Nav />
{@render children()}
