import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	groupAPI,
	inviteFriend,
	enjoyGroup,
	leaveGroup,
	listPostGroup,
	createPostGroup,
	myGroup,
	adminGroup,
	memberGroup,
	listTagGroup,
	searchGroup,
	groupDetailAPI,
	likeCommentGroupAPI,
	unFollowGroupAPI,
	followGroupAPI,
	recommendGroup,
	replyInviteGroupAPI,
} from 'constants/apiURL';
import Request from 'helpers/Request';

export const getGroupList = createAsyncThunk('group/getGroupList', async (params = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(groupAPI, params);
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getRecommendGroup = createAsyncThunk(
	'group/getRecommendGroup',
	async (params = {}, { rejectWithValue }) => {
		try {
			const res = await Request.makeGet(recommendGroup, params);
			return res.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getGroupDettail = createAsyncThunk('group/getGroupDettail', async (id, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(groupDetailAPI(id));
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getupdateBackground = createAsyncThunk(
	'group/getupdateBackground',
	async (params, { rejectWithValue }) => {
		const { id, param } = params;
		try {
			const res = await Request.makePatch(groupDetailAPI(id), param);
			return res;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const editGroup = createAsyncThunk('group/editGroup', async (params = {}, { rejectWithValue }) => {
	const { id, param } = params;
	try {
		const res = await Request.makePatch(groupDetailAPI(id), param);
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const likeAndUnlikeGroupComment = createAsyncThunk(
	'group/like group comment',
	async (id, { rejectWithValue }) => {
		try {
			const res = await Request.makePatch(likeCommentGroupAPI(id));
			return res;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getTagGroup = createAsyncThunk('group/getTagGroup', async (params, { rejectWithValue }) => {
	const { id, body } = params;
	try {
		const res = await Request.makeGet(listTagGroup(id), body);
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getMyGroup = createAsyncThunk('group/getMyGroup', async (params = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(myGroup, params);
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getMyAdminGroup = createAsyncThunk('group/getMyAdminGroup', async (params = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(adminGroup, params);
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getFillterGroup = createAsyncThunk('search/getFillterGroup', async (params, { rejectWithValue }) => {
	const { id } = params;
	const newParams = { q: params.q };
	try {
		const response = await Request.makeGet(searchGroup(id), newParams);
		return response.data;
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

export const getMember = createAsyncThunk('group/getMember', async (id = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(memberGroup(id));
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getCreatGroup = createAsyncThunk('group/getCreatGroup', async (data = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makePost(groupAPI, data);
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getListPost = createAsyncThunk('group/getListPost', async (params = {}, { rejectWithValue }) => {
	const { id, query } = params;
	try {
		const res = await Request.makeGet(listPostGroup(id), query);
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const creatNewPost = createAsyncThunk('group/creatNewPost', async (params = {}, { rejectWithValue }) => {
	const { id, data } = params;

	try {
		const res = await Request.makePost(createPostGroup(id), data);
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getEnjoyGroup = createAsyncThunk('group/getEnjoyGroup', async (id = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makePost(enjoyGroup(id));
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getInviteFriend = createAsyncThunk('group/getInviteFriend', async (params = {}, { rejectWithValue }) => {
	const { id } = params;

	const userId = {
		userIds: params.userIds,
	};
	try {
		const res = await Request.makePost(inviteFriend(id), userId);
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const leaveGroupUser = createAsyncThunk('group/leaveGroupUser', async (params = {}, { rejectWithValue }) => {
	const { id } = params;

	try {
		const res = await Request.makeDelete(leaveGroup(id));
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const unFollowGroupUser = createAsyncThunk('group/unFollowGroupUser', async (id, { rejectWithValue }) => {
	try {
		const res = await Request.makePost(unFollowGroupAPI(id));
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const followGroupUser = createAsyncThunk('group/followGroupUser', async (id, { rejectWithValue }) => {
	try {
		const res = await Request.makePost(followGroupAPI(id));
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const replyInviteGroup = createAsyncThunk('group/replyInviteGroup', async (params = {}, { rejectWithValue }) => {
	const { id, body } = params;
	try {
		const res = await Request.makePost(replyInviteGroupAPI(id), body);
		return res;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

const groupSlice = createSlice({
	name: 'group',
	initialState: {
		isFetching: false,
		currentGroupArrived: {},
		error: {},
		key: 'intro',
		resetGroupList: true,
	},
	reducers: {
		updateKey: (state, action) => {
			state.key = action.payload;
		},
		handleResetGroupList: state => {
			state.resetGroupList = !state.resetGroupList;
		},
	},
	extraReducers: {
		[getGroupDettail.pending]: state => {
			state.isFetching = true;
		},
		[getGroupDettail.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.currentGroupArrived = action.payload;
		},
		[getGroupDettail.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
	},
});

const group = groupSlice.reducer;

export default group;
export const { updateKey, handleResetGroupList } = groupSlice.actions;
