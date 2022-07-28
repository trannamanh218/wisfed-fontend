import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSearchAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getFilterSearch = createAsyncThunk('search/getSearch', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(getSearchAPI, params);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

const searchSlice = createSlice({
	name: 'search',
	initialState: {
		isShowModal: false,
	},
	reducers: {
		handleResetValue: (state, action) => {
			state.isShowModal = action.payload;
		},
	},
});

export const { handleResetValue } = searchSlice.actions;

const search = searchSlice.reducer;
export default search;
