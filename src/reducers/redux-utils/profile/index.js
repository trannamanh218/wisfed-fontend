import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Request from 'helpers/Request';
import { getFavoriteAuthorAPI } from 'constants/apiURL';

export const getFavoriteAuthor = createAsyncThunk('common/getListCopyrights', async (params, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(getFavoriteAuthorAPI, params);
		return res.data.rows;
	} catch (err) {
		const error = err.response.message;
		return rejectWithValue(error);
	}
});

const profileSlice = createSlice({
	name: 'profile',
	initialState: {
		toggle: '',
		checkUser: false,
	},
	reducers: {
		changeToggle: (state, action) => {
			state.toggle = action.payload;
		},
		checkGetUser: (state, action) => {
			state.checkUser = action.payload;
		},
	},
});

export const { changeToggle, checkGetUser } = profileSlice.actions;

const profile = profileSlice.reducer;
export default profile;
