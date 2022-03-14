import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	bookAllReviewAPI,
	bookAPI,
	bookDetailAPI,
	bookElasticSearchAPI,
	bookFollowReviewAPi,
	bookFriendReviewAPi,
} from 'constants/apiURL';
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

export const getBookDetail = createAsyncThunk('book/getBookDetail', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(bookDetailAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getReviewOfBook = createAsyncThunk('book/getAllReviewOfBook', async (params, { rejectWithValue }) => {
	const { id, option, ...query } = params;
	try {
		let response;
		switch (option) {
			case 'followReviews':
				response = await Request.makeGet(bookFollowReviewAPi(id), query);
				break;
			case 'friendReviews':
				response = await Request.makeGet(bookFriendReviewAPi(id), query);
				break;
			default:
				response = await Request.makeGet(bookAllReviewAPI(id), query);
		}
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

const bookSlice = createSlice({
	name: 'book',
	initialState: {
		isFetching: false,
		booksData: { rows: [], count: 0 },
		error: {},
		bookInfo: {},
		bookReviewData: {},
	},
	extraReducers: {
		[getBookDetail.pending]: state => {
			state.isFetching = true;
		},
		[getBookDetail.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.bookInfo = action.payload;
			state.error = {};
		},
		[getBookDetail.rejected]: (state, action) => {
			state.isFetching = false;
			state.bookInfo = {};
			state.error = action.payload;
		},
		[getReviewOfBook.pending]: state => {
			state.isFetching = true;
		},
		[getReviewOfBook.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.bookReviewData = action.payload;
			state.error = {};
		},
		[getReviewOfBook.rejected]: (state, action) => {
			state.isFetching = false;
			state.bookReviewData = {};
			state.error = action.payload;
		},
	},
});

const book = bookSlice.reducer;
export default book;
