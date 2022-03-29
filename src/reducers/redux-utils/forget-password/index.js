import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	keyChange: false,
};

const forgetPasswordSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		changeKey: (state, action) => {
			state.keyChange = action.payload;
		},
	},
});

export const { changeKey } = forgetPasswordSlice.actions;

const forgetPasswordSliceReducer = forgetPasswordSlice.reducer;
export default forgetPasswordSliceReducer;
