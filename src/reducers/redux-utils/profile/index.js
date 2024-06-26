import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Request from 'helpers/Request';
import { getFavoriteAuthorAPI } from 'constants/apiURL';

export const getFavoriteAuthor = createAsyncThunk('common/getListCopyrights', async (data, { rejectWithValue }) => {
	try {
		const { id, params } = data;
		const res = await Request.makeGet(getFavoriteAuthorAPI(id), params);
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
	},
	reducers: {
		changeToggle: (state, action) => {
			state.toggle = action.payload;
		},
	},
});

export const { changeToggle } = profileSlice.actions;

const profile = profileSlice.reducer;
export default profile;
