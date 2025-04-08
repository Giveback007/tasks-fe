<script lang="ts">
	import "@picocss/pico";
	import "../app.css";
	import Nav from "$lib/components/Nav.comp.svelte";
	import { onMount } from "svelte";
	import { initStoreSync } from "$lib/store/sync.store";
	import { initStore } from "$lib/store/store.init";
	import { pwaInfo } from "virtual:pwa-info";
	import { pwaAssetsHead } from "virtual:pwa-assets/head";
	(globalThis as any).log = console.log;
	(globalThis as any).darkMode = () => {

	}

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "",);

	let { children } = $props();

	onMount(async () => {
		initStore();
		initStoreSync();

		if (!pwaInfo) return;
		const { registerSW } = (await import("virtual:pwa-register")) as any;

		registerSW({
			immediate: true,
			onRegistered(r: any) {
				if (!r) return;
				r.update();

				setInterval(() => {
					console.log("Checking for sw update");
					r.update();
				}, 60 * 60 * 1000);

				console.log(`SW Registered: ${r}`);
			},
			onRegisterError(error: any) {
				console.log("SW registration error", error);
			},
		});

	});
</script>

<svelte:head>
	{@html webManifestLink}

	{#if pwaAssetsHead?.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}

	{#each pwaAssetsHead?.links || [] as link}
		<link {...link} />
	{/each}
</svelte:head>

<Nav />
{@render children()}
