import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
	name: 'profile',
	initialState: {
		toggle: '',
	},
	reducers: {
		changeToggle: (state, action) => {
			state.toggle = action.payload;
		},
	},
	extraReducers: {},
});

export const { changeToggle } = profileSlice.actions;

const profile = profileSlice.reducer;
export default profile;
