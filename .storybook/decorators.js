import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import App from '../src/App';

export const withRouter = (StoryFn, { parameters: { deeplink } }) => {
	// if there's no deeplink config, just return the story in a Router
	if (!deeplink) {
		return (
			<BrowserRouter>
				<StoryFn />
			</BrowserRouter>
		);
	}

	const { path, route } = deeplink;

	return (
		// <MemoryRouter initialEntries={[encodeURI(route)]}>
		//   <App>
		// 	<Route path={path} element={<StoryFn />} />
		//   </App>
		// </MemoryRouter>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
};

// ordered from innermost to outermost, be careful with the order!
export const globalDecorators = [withRouter];
