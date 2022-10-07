import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	bookAPI,
	bookDetailAPI,
	bookElasticSearchAPI,
	bookFollowReviewAPI,
	bookFriendReviewAPI,
	progressBookAPI,
	bookAuthorAPI,
	bookReviewAPI,
	listReviewByBookIdAPI,
	userRating,
	bookRating,
	commentBookReviewAPI,
	likeReviewsAPI,
	likeCommentReviewsAPI,
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

export const createBook = createAsyncThunk('book/getBookList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(bookAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getBookAuthorList = createAsyncThunk('book/getBookAuthorList', async (data, { rejectWithValue }) => {
	const { id, params } = data;
	try {
		const response = await Request.makeGet(bookAuthorAPI(id), params);
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
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		rejectWithValue(error);
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

export const getReviewsBook = createAsyncThunk('book/get reviews', async (data, { rejectWithValue }) => {
	const { bookId, params } = data;
	try {
		const response = await Request.makeGet(listReviewByBookIdAPI(bookId), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const createCommentReview = createAsyncThunk(
	'book/create comment review',
	async (commentReviewData, { rejectWithValue }) => {
		try {
			const response = await Request.makePost(commentBookReviewAPI, commentReviewData);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

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

export const likeAndUnlikeReview = createAsyncThunk('book/like review', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makePatch(likeReviewsAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const likeAndUnlikeCommentReview = createAsyncThunk(
	'book/like comment review',
	async (id, { rejectWithValue }) => {
		try {
			const response = await Request.makePatch(likeCommentReviewsAPI(id));
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
		currentBookReviewsNumber: 0,
	},
	reducers: {
		updateCurrentBook: (state, action) => {
			state.bookInfo = action.payload;
			state.bookForCreatePost = action.payload;
		},
		updateCurrentBookReviewsNumber: (state, action) => {
			state.currentBookReviewsNumber = action.payload;
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
export const { updateCurrentBook, updateCurrentBookReviewsNumber } = bookSlice.actions;
