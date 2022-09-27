import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTopQuotesAPI, getTopBooksAPI, getFilterTopUserAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getTopQuotes = createAsyncThunk('ranks/getTopQuotesAPI', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(getTopQuotesAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getTopBooks = createAsyncThunk('ranks/getTopBooksAPI', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(getTopBooksAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getTopUser = createAsyncThunk('ranks/getFilterTopUser', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(getFilterTopUserAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

const ranksSlice = createSlice({
	name: 'ranks',
	initialState: {},
	reducers: {},
	extraReducers: {},
});

const ranks = ranksSlice.reducer;
export default ranks;
