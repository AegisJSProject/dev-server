import { readFile } from 'node:fs/promises';
import { imports } from '@shgysk8zer0/importmap';
import { getCSP, importmap, integrity } from './csp.js';

const NO_MAP = ['controller', 'socket', 'reject', 'signal', 'resolve'];

export default async (req, context) => {
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
			.replaceAll('{{ REQUEST }}', request)
			.replaceAll('{{ CONTEXT }}', JSON.stringify(
				Object.fromEntries(Object.keys(context)
					.filter(key => ! NO_MAP.includes(key))
					.map(key => [key, context[key]])
				),
				null,
				4
			)),
		{
			headers: {
				'Content-Type': 'text/html',
				'Content-Security-Policy': getCSP(),
			}
		}
	);
};
