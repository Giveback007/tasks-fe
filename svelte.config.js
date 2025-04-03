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
	// prerender: {
	// 	crawl: false,
	// 	entries: [
	// 		// '/robots.txt',
	// 		// '/sitemap.xml',

	// 		// Static json:
	// 		'/data/search.json',
	// 		'/data/static.json',
	// 		'/data/search-properties-data.json',
	// 		'/data/neighborhoods.json',
	// 		'/dev/route-dev.json',

	// 		// static routes
	// 		'/',
	// 		'/services',
	// 		'/appraisals',
	// 		'/contact-us',
	// 		'/about-us',
	// 		'/contact-us',

	// 		// dynamic routes: crawl the CMS and generate a JSON with all ids, slugs, etc. of the following dynamic entities
	// 		// SEE: https://reecemay.me/articles/tip_sveltekit_static_pages_with_prismic/
	// 		//   ...route-list
	// 		],
	// 	},
	}
};

export default config;
