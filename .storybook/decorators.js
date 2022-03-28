import React from 'react';
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom';
import App from '../src/App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../src/reducers/redux-utils';

export const withRouter = (StoryFn, { parameters: { deeplink } }) => {

	if (!deeplink) {
		return (
			<BrowserRouter>
				<StoryFn />
			</BrowserRouter>
		);
	}

	return (
		<MemoryRouter initialEntries={[encodeURI(route)]}>
			<App>
				<Route path={path} element={<StoryFn />} />
			</App>
		</MemoryRouter>
	);
};


export const withStore = (StoryFn, { parameters }) => {
	// Creates a store by merging optional custom initialState
	const store = configureStore({
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: false,
			}),
		reducer: rootReducer,
		preloadedState: parameters.store?.initialState, // if undefined, just use default state from reducers
	});

	return (
		<Provider store={store}>
			<StoryFn />
		</Provider>
	);
};

// ordered from innermost to outermost, be careful with the order!
export const globalDecorators = [withRouter, withStore];
