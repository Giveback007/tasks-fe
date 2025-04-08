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
			fallback: "index.html",
		}),
		prerender: {
			crawl: false,
			entries: [
				'/',
				'/settings',
				'/data/sounds.json',
			],
		},
		// Add this to disable SvelteKit's default service worker
		serviceWorker: {
			register: false
		},
		files: {
			serviceWorker: 'src/sw.js', // or `src/my-sw.ts`
		}
	}
};

export default config;