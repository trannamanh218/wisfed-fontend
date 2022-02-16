import '../node_modules/react-bootstrap/dist/react-bootstrap';
import '../src/scss/main.scss';
import { globalDecorators } from './decorators';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

export const decorators = globalDecorators;
