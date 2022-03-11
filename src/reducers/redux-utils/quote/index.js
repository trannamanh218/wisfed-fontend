import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { quoteAPI, quoteDetailAPI } from 'constants/apiURL';
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

export const creatQuotes = createAsyncThunk('quote/creat quotes', async (data, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(quoteAPI, data);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getQuoteDetail = createAsyncThunk('quote/get quote list', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(quoteDetailAPI(id));
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
		resetQuoteList: false,
		toDetailFromMyQuotes: false,
	},

	reducers: {
		handleAfterCreatQuote: state => {
			state.resetQuoteList = !state.resetQuoteList;
		},
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

export const { handleAfterCreatQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
