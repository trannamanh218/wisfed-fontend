import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { quoteAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getQuoteList = createAsyncThunk('quote/get quote list', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(quoteAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

const quoteSlice = createSlice({
	name: 'quoteSlice',
	initialState: {
		isFetching: false,
		quotesData: {},
		error: {},
	},
	extraReducers: {
		[getQuoteList.pending]: state => {
			state.isFetching = true;
		},
		[getQuoteList.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.quotesData = action.payload;
			state.error = {};
		},
		[getQuoteList.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
			state.quotesData = {};
		},
	},
});

export default quoteSlice.reducer;
