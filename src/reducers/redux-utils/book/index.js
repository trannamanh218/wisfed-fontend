import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	bookAllReviewAPI,
	bookAPI,
	bookDetailAPI,
	bookElasticSearchAPI,
	bookFollowReviewAPi,
	bookFriendReviewAPi,
	progressBookAPI,
	bookAuthor,
	userRating,
	bookRating,
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

export const ratingUser = createAsyncThunk('book/ratingBookUser', async (params, { rejectWithValue }) => {
	const id = params.id;
	const star = { star: params.star };
	try {
		const response = await Request.makePost(userRating(id), star);
		return response;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getRatingBook = createAsyncThunk('book/getRatingBook', async (id, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(bookRating(id));
		// const data = JSON.parse(res.data).data;
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		rejectWithValue(error);
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

export const updateProgressReadingBook = createAsyncThunk(
	'library/updateProgressReadingBook',
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
		ratingBookStart: null,
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
		[getReviewOfBook.pending]: state => {
			state.isFetching = true;
		},
		[getRatingBook.pending]: state => {
			state.isFetching = true;
		},
		[getRatingBook.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.ratingBookStart = action.payload;
			state.error = {};
		},
		[getRatingBook.rejected]: (state, action) => {
			state.isFetching = false;
			state.ratingBookStart = {};
			state.error = action.payload;
		},
	},
});

const book = bookSlice.reducer;
export default book;
export const { updateCurrentBook } = bookSlice.actions;
