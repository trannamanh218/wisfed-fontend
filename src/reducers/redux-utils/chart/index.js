import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	listBooksReadYear,
	getReadingTargetAPI,
	updateTargetReadAPI,
	getAPIchartsByid,
	getReadingTargetIdAPI,
	getBooksChartsData,
} from 'constants/apiURL';
import Request from 'helpers/Request';

export const getChartsByid = createAsyncThunk('targetReading/getListChartsId', async (params, { rejectWithValue }) => {
	const { userId, by, count } = params;
	try {
		const response = await Request.makeGet(getAPIchartsByid(userId, count, by));
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const getChartsBooks = createAsyncThunk(
	'targetReading/getListChartsBook',
	async (params, { rejectWithValue }) => {
		const { id, ...query } = params;
		try {
			const response = await Request.makeGet(getBooksChartsData(id), query);
			return response.data;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const getListBooksReadYear = createAsyncThunk(
	'chart/getListBooksReadYear',
	async (params, { rejectWithValue }) => {
		const { type, userId } = params;
		try {
			const response = await Request.makeGet(listBooksReadYear(type, userId));
			return response.data;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const getListBooksTargetReading = createAsyncThunk(
	'targetReading/getListBooksTargetRead',
	async (userId, { rejectWithValue }) => {
		try {
			const response = await Request.makeGet(getReadingTargetIdAPI(userId));
			return response.data.rows;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const updateTargetRead = createAsyncThunk(
	'targetReading/updateTargetRead',
	async (params, { rejectWithValue }) => {
		const { year, ...query } = params;
		try {
			const response = await Request.makePatch(updateTargetReadAPI(year), query);
			return response.data.rows;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const createTargetRead = createAsyncThunk(
	'targetReading/createTargetRead',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makePost(getReadingTargetAPI, params);
			return response.data.rows;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const deleteTargetRead = createAsyncThunk(
	'targetReading/deleteTargetRead',
	async (params, { rejectWithValue }) => {
		const { year } = params;
		try {
			const response = await Request.makeDelete(updateTargetReadAPI(year));
			return response.data.rows;
		} catch (err) {
			const error = JSON.stringify(err.response);
			throw rejectWithValue(error);
		}
	}
);

const chartSlice = createSlice({
	name: 'chart',
	initialState: {
		imageToShareData: [],
		isFetching: false,
		error: {},
		myTargetReading: [],
		resetMyTargetReading: false,
	},
	reducers: {
		handleSetImageToShare: (state, action) => {
			state.imageToShareData = action.payload;
		},
		setMyTargetReading: (state, action) => {
			state.myTargetReading = action.payload;
		},
		handleResetMyTargetReading: state => {
			state.resetMyTargetReading = !state.resetMyTargetReading;
		},
	},
});

export const { handleSetImageToShare, setMyTargetReading, handleResetMyTargetReading } = chartSlice.actions;
const chart = chartSlice.reducer;

export default chart;
