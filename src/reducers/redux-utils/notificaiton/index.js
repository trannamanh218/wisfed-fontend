import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Request from 'helpers/Request';
import {
	nottificationAPI,
	postReadNotification,
	detailFeedPost,
	detailFeedPostGroup,
	notificationUnRead,
} from 'constants/apiURL';

export const getNotification = createAsyncThunk('notification/getNotification', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(nottificationAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getDetailFeed = createAsyncThunk('notification/getDetailFeed', async (params, { rejectWithValue }) => {
	const { id } = params;
	try {
		const response = await Request.makeGet(detailFeedPost(id));
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getDetailFeedGroup = createAsyncThunk(
	'notification/getDetailFeedGroup',
	async (params, { rejectWithValue }) => {
		const { id } = params;
		try {
			const response = await Request.makeGet(detailFeedPostGroup(id));
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const readNotification = createAsyncThunk(
	'notification/getNotification',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makePost(postReadNotification, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const getListNotificationUnRead = createAsyncThunk(
	'notification/getListUnReadNotficaiton',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makeGet(notificationUnRead, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

const notificationSlice = createSlice({
	name: 'notification',
	initialState: {
		toggle: null,
		activeKeyTabs: '',
		listNotifcaiton: [],
		isRealTime: null,
	},
	reducers: {
		backgroundToggle: (state, action) => {
			state.toggle = action.payload;
		},
		activeKeyTabsNotification: (state, action) => {
			state.activeKeyTabs = action.payload;
		},
		handleListNotification: (state, action) => {
			state.listNotifcaiton = action.payload;
		},
		depenRenderNotificaion: (state, action) => {
			state.isRealTime = action.payload;
		},
	},
	extraReducers: {
		[getNotification.pending]: state => {
			state.isFetching = true;
		},
		[getNotification.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.bookInfo = action.payload;
			state.error = {};
		},
		[getNotification.rejected]: (state, action) => {
			state.isFetching = false;
			state.bookInfo = {};
			state.error = action.payload;
		},
	},
});

export const { backgroundToggle, activeKeyTabsNotification, handleListNotification, depenRenderNotificaion } =
	notificationSlice.actions;

const notificationReducer = notificationSlice.reducer;
export default notificationReducer;
