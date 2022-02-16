import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postAPI, postDetailAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getPostList = createAsyncThunk('post/getPostList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(postAPI, params);
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

export const createPost = createAsyncThunk('post/createPost', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(postAPI);
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
	},
	extraReducers: {
		[getPostList.pending]: state => {
			state.isFetching = true;
		},
		[getPostList.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.postsData = action.payload;
			state.error = {};
		},
		[getPostList.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
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

const post = postSlice.reducer;
export default post;
