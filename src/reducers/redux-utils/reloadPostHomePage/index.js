import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	reloadCount: 0,
};

const ReloadPostsSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
		increment: state => {
			state.reloadCount += 1;
		},
	},
});

export const { increment } = ReloadPostsSlice.actions;

const task = ReloadPostsSlice.reducer;

export default task;
