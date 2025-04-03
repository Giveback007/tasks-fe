import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',

			// ! NOTE:
			/** DO NOT NAME THIS index.html (it will override the pre-rendered index.html) */
			fallback: "CSR.html",
		}),
		prerender: {
			crawl: false,
			entries: [
					'/data/sounds.json',
				],
			},
	}
};

export default config;
