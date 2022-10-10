import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	shareApiRanks,
	postAPI,
	postDetailAPI,
	previewLink,
	getPostsByUserAPI,
	shareInternalAPI,
	shareApiAuthorBook,
	shareApiMyBook,
	getMiniPostCommentsAPI,
	getGroupPostCommentsAPI,
} from 'constants/apiURL';
import Request from 'helpers/Request';

export const getPostsByUser = createAsyncThunk('post/getPostListByUser', async (data, { rejectWithValue }) => {
	try {
		const { userId, params } = data;
		const response = await Request.makeGet(getPostsByUserAPI(userId), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getPostDetail = createAsyncThunk('post/getPostDetail', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(postDetailAPI(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getSharePostInternal = createAsyncThunk('post/getPostDetail', async (query, { rejectWithValue }) => {
	const { id, type, ...params } = query;
	try {
		const response = await Request.makePost(shareInternalAPI(id, type), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getSharePostRanks = createAsyncThunk('post/getPostRanks', async (query, { rejectWithValue }) => {
	const { id, ...params } = query;
	try {
		const response = await Request.makePost(shareApiRanks(id), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const shareMyBook = createAsyncThunk('post/shareMyBook', async (query, { rejectWithValue }) => {
	const { id, ...params } = query;
	try {
		const response = await Request.makePost(shareApiMyBook(id), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const createPost = createAsyncThunk('post/createPost', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(postAPI);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getPreviewUrl = createAsyncThunk('post/getPreviewUrl', async (data, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(previewLink, data);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getMiniPostComments = createAsyncThunk('post/getMiniPostComments', async (data, { rejectWithValue }) => {
	try {
		const { postId, params } = data;
		const response = await Request.makeGet(getMiniPostCommentsAPI(postId), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getGroupPostComments = createAsyncThunk('post/getGroupPostComments', async (data, { rejectWithValue }) => {
	try {
		const { postId, params } = data;
		const response = await Request.makeGet(getGroupPostCommentsAPI(postId), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

const postSlice = createSlice({
	name: 'post',
	initialState: {
		isFetching: false,
		postInfo: {},
		error: {},
		postDataShare: {},
	},
	reducers: {
		saveDataShare: (state, action) => {
			state.postDataShare = action.payload;
		},
	},
	extraReducers: {
		[getPostDetail.pending]: state => {
			state.isFetching = true;
		},
		[getPostDetail.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.postInfo = action.payload;
			state.error = {};
		},
		[getPostDetail.pending]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
	},
});

export const { saveDataShare } = postSlice.actions;
const post = postSlice.reducer;
export default post;
