import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/redux-utils';

const store = configureStore({
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== 'production',
});

export default store;
