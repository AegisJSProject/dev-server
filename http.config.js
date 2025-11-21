import home from '@aegisjsproject/dev-server';
import favicon from '@aegisjsproject/dev-server/favicon';

export default {
	open: true,
	routes: {
		'/': home,
		'/favicon.svg': favicon,
	}
};
