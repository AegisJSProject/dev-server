import home from '@aegisjsproject/dev-server';
import favicon from '@aegisjsproject/dev-server/favicon';
import { useCSP } from './csp.js';

export default {
	open: true,
	routes: {
		'/': home,
		'/favicon.svg': favicon,
	},
	responsePostprocessors: [useCSP()],
};
