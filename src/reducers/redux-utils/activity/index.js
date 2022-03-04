import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { activityAPI, bookAPI, categoryAPI, friendAPI, userAPI } from 'constants/apiURL';
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

export const getSuggestion = createAsyncThunk('activity/getSuggestion', async (params, { rejectWithValue }) => {
	const { input, option, userInfo } = params;
	const filter = [];
	let property = 'name';
	if (option.value === 'add-friends' || option.value === 'add-author') {
		property = 'fullName,firstName,lastName';
	}

	if (option.value === 'add-author') {
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
			case 'add-book': {
				const response = await Request.makeGet(bookAPI, query);
				data = response.data;
				break;
			}
			case 'add-topic': {
				const response = await Request.makeGet(categoryAPI, query);
				data = response.data;
				break;
			}
			case 'add-author': {
				const response = await Request.makeGet(userAPI, query);
				data = response.data;
				break;
			}
			case 'add-friends': {
				const response = await Request.makeGet(friendAPI(userInfo.id), query);
				data = response.data;
				break;
			}
			default:
				break;
		}
		return data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		// console.log(err);
		throw rejectWithValue(error);
	}
});
const activitySlice = createSlice({
	name: 'activity',
	initialState: {},
	error: {},
});

const activity = activitySlice.reducer;
export default activity;
