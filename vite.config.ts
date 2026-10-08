// @ts-ignore
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import vue from '@vitejs/plugin-vue';
// @ts-ignore
import { bunny } from 'laravel-vite-plugin/fonts';
// @ts-ignore-off
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import laravel from 'laravel-vite-plugin';
import { defineConfig, lazyPlugins } from 'vite-plus';
import { templateCompilerOptions } from '@tresjs/core';

export default defineConfig({
	plugins: [
		...lazyPlugins(() => [
			laravel({
				input: [
					'resources/sass/app.scss',
					'resources/js/app.ts',
				],
				refresh: true,
				fonts: [
					bunny('Instrument Sans', {
						weights: [400, 500, 600],
					}),
				],
			}),
			inertia(),
			tailwindcss(),

			wayfinder({
				formVariants: true,
			}),
		]),
		vue({
			compilerOptions: {
				isCustomElement: (tag) => tag.startsWith('Tres'),
			},
			template: {
				transformAssetUrls: {
					base: null,
					includeAbsolute: false,
				},
			},
			...templateCompilerOptions,
		}),
	],
	server: {
		watch: {
			ignored: [
				'**/.agents/**',
				'**/.claude/**',
				'**/.cursor/**',
				'**/.junie/**',
				'**/vendor/**',
			],
		},
	},
	lint: {
		ignorePatterns: [
			'vendor/**',
			'node_modules/**',
			'public/**',
			'bootstrap/ssr/**',
			'tailwind.config.js',
			'resources/js/actions/**',
			'resources/js/components/ui/*',
			'resources/js/routes/**',
			'resources/js/wayfinder/**',
		],
		options: {
			denyWarnings: true,
			typeAware: true,
		},
	},
	fmt: {
		printWidth: 80,
		tabWidth: 4,
		singleQuote: true,
		semi: true,
		singleAttributePerLine: false,
		htmlWhitespaceSensitivity: 'css',
		ignorePatterns: [
			'.github/**',
			'composer.json',
			'resources/js/components/ui/*',
			'resources/views/mail/*',
		],
		sortTailwindcss: {
			functions: ['clsx', 'cn', 'cva'],
			stylesheet: 'resources/css/app.css',
		},
	},
});
