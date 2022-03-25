import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { friendAPI, makeFriendAPI, userAPI, checkLikedAPI, updateLikeCategory } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getUserList = createAsyncThunk('user/getUserList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(userAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getFriendList = createAsyncThunk('user/getFriendList', async (params, { rejectWithValue }) => {
	const { id, ...restParams } = params;
	try {
		const response = await Request.makeGet(friendAPI(id), restParams);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const makeFriendRequest = createAsyncThunk('user/makeFriendRequest', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(makeFriendAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getCheckLiked = createAsyncThunk('user/check liked', async (params, { rejectWithValue }) => {
	const { id, ...restParams } = params;
	try {
		const response = await Request.makeGet(checkLikedAPI(id), restParams);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getLikeCategory = createAsyncThunk('user/updateLikeCategory', async (params, { rejectWithValue }) => {
	const { id, ...restParams } = params;
	try {
		const response = await Request.makeGet(updateLikeCategory(id), restParams);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

const userSlice = createSlice({
	name: 'user',
	initialState: {
		isFetching: false,
		categoriesData: {},
		error: {},
	},
});

const user = userSlice.reducer;
export default user;
