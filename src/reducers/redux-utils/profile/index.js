import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Request from 'helpers/Request';

const profileSlice = createSlice({
	name: 'profile',
	initialState: {
		toggle: null,
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
