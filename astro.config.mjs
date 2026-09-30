// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import gramatica from './src/lib/cometa.tmLanguage.json' with { type: 'json' };
import rehypeEnlaces from "./src/lib/enlaces.mjs";
import { BASE } from './src/lib/sitio.ts';
import { temaCometa } from './src/lib/tema.ts';

export default defineConfig({
	site: 'https://crsolver.github.io',
	base: BASE,
	integrations: [sitemap()],
	markdown: {
		processor: unified({ rehypePlugins: [rehypeEnlaces] }),
		shikiConfig: {
			theme: temaCometa,
			langs: [{ ...gramatica, name: 'cometa' }],
		},
	},
});
