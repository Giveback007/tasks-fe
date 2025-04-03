import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

function onBuildError(errType, err) {
	console.log('\n\n\n\n// 🢃🢃🢃🢃🢃 // ----- // BUILD-ERROR // ----- // 🢃🢃🢃🢃🢃 //\n// 🢃🢃🢃🢃🢃 // ----- // BUILD-ERROR // ----- // 🢃🢃🢃🢃🢃 //\n\n');
    console.log(`❌ [< ERROR >]: ${errType}:\n`, err, { ...err });
	console.log('\n\n// 🢁🢁🢁🢁🢁 // ----- // BUILD-ERROR // ----- // 🢁🢁🢁🢁🢁 //\n// 🢁🢁🢁🢁🢁 // ----- // BUILD-ERROR // ----- // 🢁🢁🢁🢁🢁 //\n\n\n\n');

	setTimeout(() => process.exit(1), 12_000);
}

process.on('unhandledRejection', (reason) => onBuildError('Unhandled Rejection', reason));
process.on('uncaughtException', (error) => onBuildError('Uncaught Exception', error));

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
