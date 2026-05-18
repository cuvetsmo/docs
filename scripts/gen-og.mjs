// One-off generator for the Open Graph share image at public/og.png.
// Run with: node scripts/gen-og.mjs
// Produces a 1200x630 sky-gradient card with CUVETSMO logo + title.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const logoPath = resolve(root, 'public/smo-logo.png');
const outPath = resolve(root, 'public/og.png');

const W = 1200;
const H = 630;

// Sky gradient background + soft glow, rendered as SVG and rasterised by Sharp.
// Fonts are not embedded; we use generic families that look reasonable when
// rasterized server-side. The visual hierarchy is the logo + bold title.
const bgSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
	<defs>
		<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="#0c4a6e" />
			<stop offset="55%" stop-color="#0369a1" />
			<stop offset="100%" stop-color="#075985" />
		</linearGradient>
		<radialGradient id="glow" cx="78%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.35" />
			<stop offset="100%" stop-color="#7dd3fc" stop-opacity="0" />
		</radialGradient>
		<linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stop-color="#7dd3fc" stop-opacity="0" />
			<stop offset="50%" stop-color="#7dd3fc" stop-opacity="0.6" />
			<stop offset="100%" stop-color="#7dd3fc" stop-opacity="0" />
		</linearGradient>
	</defs>
	<rect width="${W}" height="${H}" fill="url(#sky)" />
	<rect width="${W}" height="${H}" fill="url(#glow)" />
	<rect x="60" y="80" width="1080" height="2" fill="url(#line)" />
	<rect x="60" y="548" width="1080" height="2" fill="url(#line)" />

	<text x="80" y="135" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="600" fill="#bae6fd" letter-spacing="6">
		CUVETSMO
	</text>

	<text x="80" y="290" font-family="Inter, Arial, sans-serif" font-size="92" font-weight="800" fill="#ffffff">
		Developer Docs
	</text>

	<text x="80" y="370" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="500" fill="#bae6fd">
		Architecture · Onboarding · Succession
	</text>

	<text x="80" y="430" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="400" fill="#e0f2fe" opacity="0.85">
		The developer wiki for the CU Vet student union web platform.
	</text>

	<text x="80" y="600" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="600" fill="#7dd3fc">
		docs.cuvetsmo.com
	</text>
</svg>
`);

async function main() {
	// Prepare the logo: 360px on a side, rounded square with subtle shadow.
	const logoSize = 360;
	const logo = await sharp(logoPath)
		.resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.toBuffer();

	await sharp(bgSvg)
		.composite([
			{
				input: logo,
				top: Math.round((H - logoSize) / 2),
				left: W - logoSize - 80,
			},
		])
		.png({ compressionLevel: 9 })
		.toFile(outPath);

	console.log('og.png written →', outPath);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
