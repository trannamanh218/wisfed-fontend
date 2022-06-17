import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postAPI, postDetailAPI, previewLink, getPostsByUserAPI, shareInternalAPI } from 'constants/apiURL';
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

const postSlice = createSlice({
	name: 'post',
	initialState: {
		isFetching: false,
		postsData: {},
		postInfo: {},
		error: {},
		resetTaggedData: false,
		isShare: false,
		isSharePosts: false,
	},
	reducers: {
		resetTaggedDataFunc: (state, action) => {
			state.resetTaggedData = action.payload;
		},
		saveDataShare: (state, action) => {
			state.postsData = action.payload;
		},
		checkShare: (state, action) => {
			state.isShare = action.payload;
		},
		sharePosts: (state, action) => {
			state.isSharePosts = action.payload;
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
export const { resetTaggedDataFunc, saveDataShare, checkShare, sharePosts } = postSlice.actions;
const post = postSlice.reducer;
export default post;
