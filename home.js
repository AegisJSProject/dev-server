import { readFile } from 'node:fs/promises';
import { imports } from '@shgysk8zer0/importmap';

const pkg = JSON.parse(await readFile(process.cwd() + '/package.json', { encoding: 'utf8' }));

const importmap = JSON.stringify({
	imports: {
		...imports,
		[pkg.name]: pkg.exports['.'].import,
		[`${pkg.name}/`]: './',
	}
});

const sri = async (input) => await Promise.resolve(input)
	.then(json => new TextEncoder().encode(json))
	.then(bytes => crypto.subtle.digest('SHA-384', bytes))
	.then(hash => 'sha384-' + new Uint8Array(hash).toBase64());

const integrity = await sri(importmap);

const CSP = `default-src 'self'; style-src 'self' https://unpkg.com/@agisjsproject/ blob:; script-src 'self' https://unpkg.com/@shgysk8zer0/ https://unpkg.com/@kernvalley/ https://unpkg.com/@aegisjsproject/ '${integrity}'; image-src 'self' https://i.imgur.com/ https://secure.gravatar.com/avatar/ blob: data:; media-src 'self' blob:; frame-src https://www.youtube-nocookie.com; trusted-types aegis-sanitizer#html aegis-router#html; require-trusted-types-for 'script';`;

export default async (req) => {
	const doc = await readFile(process.cwd() + '/index.html', { encoding: 'utf8' });

	const request = JSON.stringify({
		url: req.url,
		method: req.method,
		destination: req.destination,
		mode: req.mode,
		cache: req.cache,
		referrer: req.referrer,
		headers: Object.fromEntries(req.headers),
	}, null, 4);

	return new Response(
		doc
			.replaceAll('{{ IMPORTMAP }}', importmap)
			.replaceAll('{{ INTEGRITY }}', integrity)
			.replaceAll('{{ POLYFILLS }}', imports['@shgysk8zer0/polyfills'])
			.replaceAll('{{ REQUEST }}', request),
		{
			headers: {
				'Content-Type': 'text/html',
				'Content-Security-Policy': CSP,
			}
		}
	);
};
