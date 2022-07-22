import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	friendAPI,
	makeFriendAPI,
	userAPI,
	replyFriendReqApi,
	cancelFriendApi,
	listFolowrs,
	addfollow,
	unFollow,
	unFriend,
	listFollowing,
	userDetailAPI,
	myFriendsReq,
	randomAuthorAPI,
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
	const { userId, ...query } = params;
	try {
		const response = await Request.makeGet(listFolowrs(userId), query);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getFriendList = createAsyncThunk('user/getFriendList', async (params, { rejectWithValue }) => {
	const { userId, query } = params;
	try {
		const response = await Request.makeGet(friendAPI(userId), query);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getListFollowing = createAsyncThunk('user/getListFollowing', async (params, { rejectWithValue }) => {
	const { userId, ...query } = params;

	try {
		const response = await Request.makeGet(listFollowing(userId), query);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getListReqFriendsToMe = createAsyncThunk(
	'user/getListReqFriendsToMe',
	async (params, { rejectWithValue }) => {
		const { ...query } = params;
		try {
			const response = await Request.makeGet(myFriendsReq, query);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

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

export const getRandomAuthor = createAsyncThunk('user/get random author', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(randomAuthorAPI, params);
		return response.data.rows;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

const userSlice = createSlice({
	name: 'user',
	initialState: {
		isFetching: false,
		userDetail: {},
		categoriesData: {},
		error: {},
		isreload: false,
	},
	reducers: {
		handleSaveUpdate: (state, action) => {
			state.isreload = action.payload;
		},
	},

	extraReducers: {
		[getUserDetail.pending]: state => {
			state.isFetching = true;
		},
		[getUserDetail.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.userDetail = action.payload;
			state.error = {};
		},
		[getUserDetail.rejected]: (state, action) => {
			state.isFetching = false;
			state.userDetail = {};
			state.error = action.payload;
		},
	},
});

const user = userSlice.reducer;
export default user;
export const { handleSaveUpdate } = userSlice.actions;
