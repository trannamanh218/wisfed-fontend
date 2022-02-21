import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { bookAPI, bookElasticSearchAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getBookList = createAsyncThunk('book/getBookList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(bookAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getElasticSearchBookList = createAsyncThunk(
	'book/getElasticSearchBookList',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makeGet(bookElasticSearchAPI, params);

			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

const bookSlice = createSlice({
	name: 'book',
	initialState: {
		isFetching: false,
		booksData: {},
		error: {},
	},
	extraReducers: {},
});

const book = bookSlice.reducer;
export default book;
