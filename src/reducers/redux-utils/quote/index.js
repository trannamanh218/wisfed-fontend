import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	quoteAPI,
	quoteDetailAPI,
	quoteCommentAPI,
	likeQuoteAPI,
	likeQuoteCommentAPI,
	getMyLikedQuotesAPI,
	getQuotesByFriendsOrFollowersAPI,
	countQuotesByCategoryWithUserIdAPI,
	countAllQuotesByCategorydAPI,
	getQuoteCommentsAPI,
	listQuotesLikedByIdAPI,
	listHasgTagByUserAPI,
	listQuotesByTagAPI,
} from 'constants/apiURL';
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

export const getQuoteDetail = createAsyncThunk('quote/get quote detail', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(quoteDetailAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getlistQuotesLikedById = createAsyncThunk(
	'quote/get listQuotesLikedById',
	async (data, { rejectWithValue }) => {
		const { userId, params } = data;
		try {
			const response = await Request.makeGet(listQuotesLikedByIdAPI(userId), params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const creatQuotesComment = createAsyncThunk('quote/creat quotes comment', async (data, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(quoteCommentAPI, data);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const likeUnlikeQuote = createAsyncThunk('quote/like quote', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makePatch(likeQuoteAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const likeQuoteComment = createAsyncThunk('quote/like quote', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makePatch(likeQuoteCommentAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getMyLikedQuotes = createAsyncThunk('quote/get my liked quotes', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(getMyLikedQuotesAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getQuotesByFriendsOrFollowers = createAsyncThunk(
	'quote/get quote by friends or quote',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makeGet(getQuotesByFriendsOrFollowersAPI, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getCountQuotesByCategory = createAsyncThunk(
	'quote/get count quotes by category',
	async (data, { rejectWithValue }) => {
		try {
			const { params } = data;
			const response = await Request.makeGet(countAllQuotesByCategorydAPI, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getQuoteComments = createAsyncThunk('quote/getQuoteComments', async (data, { rejectWithValue }) => {
	try {
		const { quoteId, params } = data;
		const response = await Request.makeGet(getQuoteCommentsAPI(quoteId), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getlistQuotesByTag = createAsyncThunk('quotes/listQuotesByTag', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(listQuotesByTagAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getListHasgTagByUser = createAsyncThunk(
	'quote/getListHasgTagByUserAPI',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makeGet(listHasgTagByUserAPI, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

const quoteSlice = createSlice({
	name: 'quoteSlice',
	initialState: {
		isFetching: false,
		quotesData: {},
		error: {},
		resetQuoteList: false,
		categoryByQuotesName: '',
	},

	reducers: {
		handleAfterCreatQuote: state => {
			state.resetQuoteList = !state.resetQuoteList;
		},
		handleCategoryByQuotesName: (state, action) => {
			state.categoryByQuotesName = action.payload;
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

export const { handleAfterCreatQuote, handleCategoryByQuotesName } = quoteSlice.actions;
export default quoteSlice.reducer;
