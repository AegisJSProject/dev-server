import { readFile } from 'node:fs/promises';
import { imports } from '@shgysk8zer0/importmap';
import { useCSP as CSP } from '@aegisjsproject/http-utils/csp.js';

const pkg = JSON.parse(await readFile(process.cwd() + '/package.json', { encoding: 'utf8' }));

export const importmap = JSON.stringify({
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

export const integrity = await sri(importmap);

const DEFAULT_SRC = ['\'self\''];
const SCRIPT_SRC = ['\'self\'', 'https://unpkg.com/@shgysk8zer0/', 'https://unpkg.com/@kernvalley/', 'https://unpkg.com/@aegisjsproject/', `'${integrity}'`];
const STYLE_SRC = ['\'self\'', 'https://unpkg.com/@agisjsproject/', 'blob:'];
const IMAGE_SRC = ['\'self\'', 'https://i.imgur.com/', 'https://secure.gravatar.com/avatar/', 'blob:', 'data:'];
const MEDIA_SRC = ['\'self\'', 'blob:'];
const CONNECT_SRC = ['\'self\''];
const FONT_SRC = ['\'self\''];
const FRAME_SRC = ['\'self\'', 'https://www.youtube-nocookie.com'];
const TRUSTED_TYPES = ['aegis-sanitizer#html'];

export const addDefaultSrc = (...srcs) => DEFAULT_SRC.push(...srcs);
export const addScriptSrc = (...srcs) => SCRIPT_SRC.push(...srcs);
export const addStyleSrc = (...srcs) => STYLE_SRC.push(...srcs);
export const addImageSrc = (...srcs) => IMAGE_SRC.push(...srcs);
export const addMediaSrc = (...srcs) => MEDIA_SRC.push(...srcs);
export const addConnectSrc = (...srcs) => CONNECT_SRC.push(...srcs);
export const addFontSrc = (...srcs) => FONT_SRC.push(...srcs);
export const addFrameSrc = (...srcs) => FRAME_SRC.push(...srcs);
export const addTrustedType = (...policies) => TRUSTED_TYPES.push(...policies);

export const getCSP = () => [
	'default-src ' + DEFAULT_SRC.join(' '),
	'script-src ' + SCRIPT_SRC.join(' '),
	'style-src ' + STYLE_SRC.join(' '),
	'img-src ' + IMAGE_SRC.join(' '),
	'media-src ' + MEDIA_SRC.join(' '),
	'font-src ' + FONT_SRC.join(' '),
	'frame-src ' + FRAME_SRC.join(' '),
	'connect-src ' + CONNECT_SRC.join(' '),
	'tusted-types ' + TRUSTED_TYPES.join(' '),
	'require-trusted-types-for \'script\'',
].join('; ');

export const useCSP = ({ ...rest } = {}) => CSP({
	'default-src': DEFAULT_SRC,
	'script-src': SCRIPT_SRC,
	'style-src': STYLE_SRC,
	'img-src': IMAGE_SRC,
	'media-src': MEDIA_SRC,
	'font-src': FONT_SRC,
	'frame-src': FRAME_SRC,
	'connect-src': CONNECT_SRC,
	'tusted-types': TRUSTED_TYPES,
	'require-trusted-types-for': '\'script\'',
	...rest
});
