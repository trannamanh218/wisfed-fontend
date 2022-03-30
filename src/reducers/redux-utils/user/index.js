import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	friendAPI,
	makeFriendAPI,
	userAPI,
	checkLikedAPI,
	replyFriendReqApi,
	cancelFriendApi,
	listFolowrs,
	addfollow,
	unFollow,
	unFriend,
	userDetailAPI,
	updateLikeCategory,
} from 'constants/apiURL';
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

export const getListFollowrs = createAsyncThunk('user/getListFollowrs', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(listFolowrs, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getFriendList = createAsyncThunk('user/getFriendList', async (id, { rejectWithValue }) => {
	// const { id, ...restParams } = params;
	try {
		const response = await Request.makeGet(friendAPI(id));
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

export const ReplyFriendRequest = createAsyncThunk('user/makeFriendRequest', async (params, { rejectWithValue }) => {
	const { id, data } = params;
	try {
		const response = await Request.makePost(replyFriendReqApi(id), data);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const addFollower = createAsyncThunk('user/addfollowRequest', async (params, { rejectWithValue }) => {
	const { data } = params;
	try {
		const response = await Request.makePost(addfollow, data);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const unFollower = createAsyncThunk('user/unFollowRequest', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeDelete(unFollow(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});
export const unFriendRequest = createAsyncThunk('user/unFriendRequest', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeDelete(unFriend(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const CancelFriendRequest = createAsyncThunk('user/makeFriendRequest', async (params, { rejectWithValue }) => {
	const { id, data } = params;
	try {
		const response = await Request.makePost(cancelFriendApi(id), data);
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

export const editUserInfo = createAsyncThunk('user/edit user info', async (data, { rejectWithValue }) => {
	try {
		const { userId, params } = data;
		const response = await Request.makePatch(userDetailAPI(userId), params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getUserDetail = createAsyncThunk('user/get user detail', async (userId, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(userDetailAPI(userId));
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
		updateUserProfile: false,
	},
	reducers: {
		activeUpdateUserProfileStatus: state => {
			state.updateUserProfile = !state.updateUserProfile;
		},
	},
});

export const { activeUpdateUserProfileStatus } = userSlice.actions;
const user = userSlice.reducer;
export default user;
