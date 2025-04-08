import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,mp3,wav}'],
				// Add navigation fallback configuration
				navigateFallback: 'index.html',
				// Optional: You can exclude API routes or other patterns from the fallback
				navigateFallbackDenylist: [/^\/api\//, /^\/data\//],
				skipWaiting: true,
				clientsClaim: true,
				maximumFileSizeToCacheInBytes: 4 * 1_000_000,
			},
			manifest: {
				name: 'Your App Name',
				short_name: 'AppName',
				description: 'Your app description',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
		})
	]
});
