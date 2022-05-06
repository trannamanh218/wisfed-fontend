import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	getTopQuotesAPI,
	getFilterTopQuotesAPI,
	getTopBooksAPI,
	getFilterTopBooksAPI,
	getTopBooksApiAuth,
	getTopUserAPI,
	getFilterTopUserAPI,
} from 'constants/apiURL';
import Request from 'helpers/Request';

export const getTopQuotes = createAsyncThunk('ranks/getTopQuotesAPI', async (params, { rejectWithValue }) => {
	const { by } = params;
	try {
		const response = await Request.makeGet(getTopQuotesAPI(by));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getTopBooksAuth = createAsyncThunk('ranks/getTopBooksAuth', async (params, { rejectWithValue }) => {
	const { by } = params;
	try {
		const response = await Request.makeGet(getTopBooksApiAuth(by));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getFilterTopQuotes = createAsyncThunk(
	'ranks/getFilterTopQuotesAPI',
	async (params, { rejectWithValue }) => {
		const { id, by } = params;
		try {
			const response = await Request.makeGet(getFilterTopQuotesAPI(id, by));
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const getTopBooks = createAsyncThunk('ranks/getTopBooksAPI', async (params, { rejectWithValue }) => {
	const { by } = params;
	try {
		const response = await Request.makeGet(getTopBooksAPI(by));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getFilterTopBooks = createAsyncThunk('ranks/getFilterTopBooksAPI', async (params, { rejectWithValue }) => {
	const { id, by } = params;
	try {
		const response = await Request.makeGet(getFilterTopBooksAPI(id, by));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getTopUser = createAsyncThunk('ranks/getTopUser', async (params, { rejectWithValue }) => {
	const { by } = params;
	try {
		const response = await Request.makeGet(getTopUserAPI(by));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getFilterTopUser = createAsyncThunk('ranks/getFilterTopUser', async (params, { rejectWithValue }) => {
	const { by, sortType } = params;
	try {
		const response = await Request.makeGet(getFilterTopUserAPI(by, sortType));
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
