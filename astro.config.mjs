// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.cuvetsmo.com',
	markdown: {
		// Render Mermaid code-fence blocks to inline SVG at build time
		// (uses Playwright Chromium under the hood via mermaid-isomorphic)
		rehypePlugins: [[rehypeMermaid, { strategy: 'inline-svg' }]],
	},
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
