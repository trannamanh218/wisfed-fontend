import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	activityAPI,
	bookAPI,
	categoryAPI,
	friendAPI,
	likeActivityAPI,
	likeGroupPost,
	userAPI,
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

		if (input) {
			filter.push({ 'operator': 'search', 'value': input, 'property': property });
		}

		const query = {
			start: 0,
			limit: 10,
			sort: JSON.stringify([{ 'direction': 'DESC', 'property': 'createdAt' }]),
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
					const response = await Request.makeGet(categoryAPI({ option: false }), query);
					data = response.data;
					break;
				}
				case 'addAuthor': {
					const response = await Request.makeGet(userAPI, query);
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
	async (minipostId, { rejectWithValue }) => {
		try {
			const response = await Request.makePatch(likeGroupPost(minipostId));
			return response.data;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

const activitySlice = createSlice({
	name: 'activity',
	initialState: {
		isFetching: false,
		activityData: [],
		error: {},
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

const activity = activitySlice.reducer;
export default activity;
