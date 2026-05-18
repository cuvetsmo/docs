// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.cuvetsmo.com',
	// 2026-05-19: removed rehype-mermaid (mermaid-isomorphic needs Playwright
	// Chromium at build time · CF Pages build env doesn't have it). Diagrams
	// now render as code blocks — readable as text, not pretty. Future fix:
	// add a Starlight plugin that does client-side mermaid render (mermaid.js
	// in browser), trading ~50KB JS for diagrams that render without build
	// dependencies.
	integrations: [
		starlight({
			title: 'CUVETSMO Docs',
			description:
				'เอกสารพัฒนาเว็บสโมสรนิสิตสัตวแพทย์ จุฬาฯ · WebCUVETSMO architecture · developer onboarding · succession guide',
			logo: {
				src: './public/smo-logo.png',
				alt: 'CUVETSMO',
			},
			favicon: '/smo-logo.png',
			customCss: ['./src/styles/custom.css'],
			editLink: {
				baseUrl: 'https://github.com/cuvetsmo/docs/edit/main/',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/cuvetsmo' },
				{ icon: 'external', label: 'cuvetsmo.com', href: 'https://cuvetsmo.com' },
			],
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'ไทย / English',
					lang: 'th',
				},
			},
			sidebar: [
				{ label: 'Overview', link: '/' },
				{
					label: 'Architecture',
					items: [
						{ label: 'System overview', link: '/architecture/' },
						{ label: 'SSO design', link: '/architecture-sso/' },
					],
				},
				{ label: 'Onboarding', link: '/dev-onboard/' },
				{ label: 'Succession Guide', link: '/successor/' },
			],
		}),
	],
});
