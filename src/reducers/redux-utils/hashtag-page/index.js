import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Request from 'helpers/Request';
import { listPostByHashtagAPI, listPostByHashTagGroupAPI } from 'constants/apiURL';

export const getListPostByHashtag = createAsyncThunk(
	'get list post by hashtag',
	async (params, { rejectWithValue }) => {
		try {
			const res = await Request.makeGet(listPostByHashtagAPI, params);
			return res.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getListPostByHashtagGroup = createAsyncThunk(
	'get list post by hashtag from group',
	async (data, { rejectWithValue }) => {
		const { groupId, params } = data;
		try {
			const res = await Request.makeGet(listPostByHashTagGroupAPI(groupId), params);
			return res.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

const hashtagSlice = createSlice({
	name: 'hashtag-page',
	initialState: {},
});

export default hashtagSlice.reducer;
