import { createSlice } from '@reduxjs/toolkit';

const friendSlice = createSlice({
	name: 'friends',
	initialState: {
		toggleFollow: '',
	},
	reducers: {
		changeToggleFollows: (state, action) => {
			state.toggle = action.payload;
		},
	},
	extraReducers: {},
});

export const { changeToggleFollows } = friendSlice.actions;
const friends = friendSlice.reducer;
export default friends;
