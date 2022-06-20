import { createSlice } from '@reduxjs/toolkit';

const shelvesSlice = createSlice({
	name: 'shelves',
	initialState: {
		currentUserInShelves: {},
	},

	reducers: {
		setCurrentUserInShelves: (state, actions) => {
			state.currentUserInShelves = actions.payload;
		},
	},
});

export const { setCurrentUserInShelves } = shelvesSlice.actions;

export default shelvesSlice.reducer;
