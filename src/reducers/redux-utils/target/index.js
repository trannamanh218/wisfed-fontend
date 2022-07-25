import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
	name: 'target',
	initialState: {
		target: {},
	},
	reducers: {
		handleShareTarget: (state, action) => {
			state.target = action.payload;
		},
	},
	extraReducers: {},
});

export const { handleShareTarget } = searchSlice.actions;

const target = searchSlice.reducer;
export default target;
