import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { commentActivityAPI, commentGroup } from 'constants/apiURL';
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

const commentSlice = createSlice({
	name: 'comment',
	initialState: {},
});

const comment = commentSlice.reducer;
export default comment;
