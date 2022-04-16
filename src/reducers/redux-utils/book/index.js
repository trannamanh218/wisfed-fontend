import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	bookAPI,
	bookDetailAPI,
	bookElasticSearchAPI,
	bookFollowReviewAPI,
	bookFriendReviewAPI,
	progressBookAPI,
	bookAuthor,
	bookReviewAPI,
} from 'constants/apiURL';
import Request from 'helpers/Request';
import _ from 'lodash';
import { checkBookInLibraries } from '../library';

export const getBookList = createAsyncThunk('book/getBookList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(bookAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getBookAuthorList = createAsyncThunk('book/getBookAuthorList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(bookAuthor, params);
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

export const getBookDetail = createAsyncThunk('book/getBookDetail', async (params, { dispatch, rejectWithValue }) => {
	const { id, ...query } = params;

	try {
		const response = await Request.makeGet(bookDetailAPI(id));
		let status = null;

		if (!_.isEmpty(query) && !_.isEmpty(query.userId)) {
			const response_2 = await dispatch(checkBookInLibraries(id)).unwrap();
			const { rows } = response_2;
			const library = rows.find(item => item.library.isDefault);
			status = library ? library.library.defaultType : null;
		}

		return { ...response.data, status };
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const createReviewBook = createAsyncThunk('book/create review', async (reviewData, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(bookReviewAPI, reviewData);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getReviewsBook = createAsyncThunk('book/get reviews', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(bookReviewAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getReviewsBookByFriends = createAsyncThunk(
	'book/get reviews by friends',
	async (data, { rejectWithValue }) => {
		try {
			const { bookId, params } = data;
			const response = await Request.makeGet(bookFriendReviewAPI(bookId), params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getReviewsBookByFollowers = createAsyncThunk(
	'book/get reviews by followers',
	async (data, { rejectWithValue }) => {
		try {
			const { bookId, params } = data;
			const response = await Request.makeGet(bookFollowReviewAPI(bookId), params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const updateProgressReadingBook = createAsyncThunk(
	'book/updateProgressReadingBook',
	async (params, { rejectWithValue }) => {
		const { id, ...data } = params;
		try {
			const response = await Request.makePatch(progressBookAPI(id), data);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

const bookSlice = createSlice({
	name: 'book',
	initialState: {
		isFetching: false,
		booksData: { rows: [], count: 0 },
		error: {},
		bookInfo: {},
		bookReviewData: {},
		currentBook: { id: null },
		bookForCreatePost: {},
	},
	reducers: {
		updateCurrentBook: (state, action) => {
			state.bookInfo = action.payload;
			state.bookForCreatePost = action.payload;
		},
	},
	extraReducers: {
		[getBookDetail.pending]: state => {
			state.isFetching = true;
		},
		[getBookDetail.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.bookInfo = action.payload;
			state.currentBook = action.payload;
			state.error = {};
		},
		[getBookDetail.rejected]: (state, action) => {
			state.isFetching = false;
			state.bookInfo = {};
			state.error = action.payload;
		},
	},
});

const book = bookSlice.reducer;
export default book;
export const { updateCurrentBook } = bookSlice.actions;
