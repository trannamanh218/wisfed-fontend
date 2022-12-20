import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	commentActivityAPI,
	commentGroup,
	commentActivityDetailAPI,
	commentActivityGroupPostAPI,
	commentActivityReviewAPI,
	commentActivityQuoteAPI,
} from 'constants/apiURL';
import Request from 'helpers/Request';

export const createComment = createAsyncThunk('comment/createComment', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(commentActivityAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const getComments = createAsyncThunk('comment/createComment', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(commentActivityAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const createCommentGroup = createAsyncThunk(
	'comment/createCommentGroup',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makePost(commentGroup, params);
			return response.data;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const updateCommentMinipost = createAsyncThunk('comment/createComment', async (params, { rejectWithValue }) => {
	const { id, body } = params;
	try {
		const response = await Request.makePatch(commentActivityDetailAPI(id), body);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const deleteCommentMinipost = createAsyncThunk('comment/createComment', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeDelete(commentActivityDetailAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const updateCommentGroupPost = createAsyncThunk('comment/createComment', async (params, { rejectWithValue }) => {
	const { id, body } = params;
	try {
		const response = await Request.makePatch(commentActivityGroupPostAPI(id), body);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const deleteCommentGroupPost = createAsyncThunk('comment/createComment', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makePatch(commentActivityGroupPostAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const updateCommentReview = createAsyncThunk('comment/createComment', async (params, { rejectWithValue }) => {
	const { id, body } = params;
	try {
		const response = await Request.makePatch(commentActivityReviewAPI(id), body);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const deleteCommentReview = createAsyncThunk('comment/createComment', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makePatch(commentActivityReviewAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const updateCommentQuote = createAsyncThunk('comment/createComment', async (params, { rejectWithValue }) => {
	const { id, body } = params;
	try {
		const response = await Request.makePatch(commentActivityQuoteAPI(id), body);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const deleteCommentQuote = createAsyncThunk('comment/createComment', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makePatch(commentActivityQuoteAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

const commentSlice = createSlice({
	name: 'comment',
	initialState: {
		paramHandleEdit: {},
	},
	reducers: {
		setParamHandleEdit: (state, action) => {
			state.paramHandleEdit = action.payload;
		},
	},
});

export const { setParamHandleEdit } = commentSlice.actions;
const comment = commentSlice.reducer;
export default comment;
