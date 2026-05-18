// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const SITE = 'https://docs.cuvetsmo.com';
const OG_IMAGE = `${SITE}/og.png`;
const DESCRIPTION =
	'เอกสารพัฒนา WebCUVETSMO — architecture, developer onboarding, succession guide สำหรับ Vet 87/88/89 และ open-source contributors.';

// https://astro.build/config
export default defineConfig({
	site: SITE,
	integrations: [
		starlight({
			title: 'CUVETSMO Docs',
			description: DESCRIPTION,
			logo: {
				src: './public/smo-logo.png',
				alt: 'CUVETSMO',
			},
			favicon: '/smo-logo.png',
			customCss: ['./src/styles/custom.css'],
			editLink: {
				baseUrl: 'https://github.com/cuvetsmo/docs/edit/main/',
			},
			components: {
				// Custom Head: extends Starlight default + adds a client-side
				// Mermaid loader (loaded only on pages with mermaid code blocks).
				Head: './src/components/Head.astro',
				// Custom Footer: keeps Starlight pagination/edit-link/last-updated
				// and appends a CUVETSMO site footer with project + tool links.
				Footer: './src/components/Footer.astro',
			},
			head: [
				// Open Graph image — shared across every page. The og.png is a
				// static 1200x630 sky-gradient card with the CUVETSMO logo.
				{ tag: 'meta', attrs: { property: 'og:image', content: OG_IMAGE } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'CUVETSMO Docs' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: OG_IMAGE } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#0369a1' } },
			],
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
				{ label: 'Changelog', link: '/changelog/' },
			],
		}),
	],
});
