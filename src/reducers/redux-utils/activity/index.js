import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	activityAPI,
	bookAPI,
	categoryAPI,
	friendAPI,
	likeActivityAPI,
	likeGroupPost,
	randomAuthorAPI,
	likeCommentPostAPI,
} from 'constants/apiURL';
import Request from 'helpers/Request';

export const createActivity = createAsyncThunk('activity/createActivity', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(activityAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const getActivityList = createAsyncThunk('activity/getActivityList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(activityAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const handleEditPost = createAsyncThunk('activity/edit post', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePatch(activityAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const getSuggestionForPost = createAsyncThunk(
	'activity/getSuggestionForPost',
	async (params, { rejectWithValue }) => {
		const { input, option, userInfo } = params;
		const filter = [];
		let property = 'name';
		if (option.value === 'addFriends' || option.value === 'addAuthor') {
			property = 'fullName,firstName,lastName';
		}

		if (option.value === 'addAuthor') {
			filter.push({ 'operator': 'search', 'value': 'author', 'property': 'role' });
		}

		if (option.value === 'addCategory') {
			filter.push({ 'operator': 'search', 'value': input, 'property': property });
		}

		if (input) {
			filter.push({ 'operator': 'search', 'value': input, 'property': property });
		}

		const query = {
			start: 0,
			limit: 10,
			sort:
				option.value === 'addFriends'
					? null
					: JSON.stringify([{ 'direction': 'DESC', 'property': 'createdAt' }]),
			filter: JSON.stringify(filter),
		};

		try {
			let data = [];
			switch (option.value) {
				case 'addBook': {
					const response = await Request.makeGet(bookAPI, query);
					data = response.data;
					break;
				}
				case 'addCategory': {
					const response = await Request.makeGet(categoryAPI(false), query);
					data = response.data;
					break;
				}
				case 'addAuthor': {
					const response = await Request.makeGet(randomAuthorAPI, query);
					data = response.data;
					break;
				}
				case 'addFriends': {
					const response = await Request.makeGet(friendAPI(userInfo.id), query);
					data = response.data;
					break;
				}
			}
			return data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const updateReactionActivity = createAsyncThunk(
	'activity/updateReactionActivity',
	async (minipostId, { rejectWithValue }) => {
		try {
			const response = await Request.makePatch(likeActivityAPI(minipostId));
			return response.data;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const updateReactionActivityGroup = createAsyncThunk(
	'activity/updateReactionActivityGroup',
	async (groupPostId, { rejectWithValue }) => {
		try {
			const response = await Request.makePatch(likeGroupPost(groupPostId));
			return response.data;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const likeAndUnlikeCommentPost = createAsyncThunk(
	'activity/like comment miniPost',
	async (id, { rejectWithValue }) => {
		try {
			const response = await Request.makePatch(likeCommentPostAPI(id));
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

const activitySlice = createSlice({
	name: 'activity',
	initialState: {
		isFetching: false,
		activityData: [],
		error: {},
		refreshNewfeed: true,
		createNewPostForBook: false,
	},
	reducers: {
		handleRefreshNewfeed: state => {
			state.refreshNewfeed = !state.refreshNewfeed;
		},
		handleClickCreateNewPostForBook: (state, action) => {
			state.createNewPostForBook = action.payload;
		},
	},
	extraReducers: {
		[getActivityList.pending]: state => {
			state.isFetching = true;
		},
		[getActivityList.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.activityData = action.payload;
			state.error = {};
		},
		[getActivityList.rejected]: (state, action) => {
			state.isFetching = false;
			state.activityData = {};
			state.error = action.payload;
		},
	},
});

export const { handleRefreshNewfeed, handleClickCreateNewPostForBook } = activitySlice.actions;

const activity = activitySlice.reducer;

export default activity;
