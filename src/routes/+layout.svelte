<script lang="ts">
	import '@picocss/pico'
	import '../app.css';
    import Nav from "$lib/components/Nav.comp.svelte";
	(globalThis as any).log = console.log;

	let { children } = $props();
</script>

<Nav />
{@render children()}
