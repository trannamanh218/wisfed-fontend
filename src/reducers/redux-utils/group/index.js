import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
	groupAPI,
	detailGroup,
	creatGroup,
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
	updateBackground,
	bookCategoryAPI,
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

export const getIdCategory = createAsyncThunk('group/getGroupList', async (params = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(bookCategoryAPI, params);
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getGroupDettail = createAsyncThunk('group/getGroupDettail', async (id = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(detailGroup(id));

		return res;
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
			const res = await Request.makePatch(updateBackground(id), param);

			return res;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getTagGroup = createAsyncThunk('group/getTagGroup', async (id = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(listTagGroup(id));

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
		const res = await Request.makePost(creatGroup, data);
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

const groupSlice = createSlice({
	name: 'group',
	initialState: {
		isFetching: false,
		groupsData: {},
		error: {},
		key: 'intro',
	},
	reducers: {
		updateKey: (state, action) => {
			state.key = action.payload;
		},
	},
	extraReducers: {
		[getGroupList.pending]: state => {
			state.isFetching = true;
		},
		[getGroupList.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.groupsData = action.payload;
		},
		[getGroupList.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
		[getGroupDettail.pending]: state => {
			state.isFetching = true;
		},
		[getGroupDettail.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.groupsData = action.payload;
		},
		[getGroupDettail.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
	},
});

const group = groupSlice.reducer;

export default group;
export const { updateKey } = groupSlice.actions;
