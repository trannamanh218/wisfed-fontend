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
	async (params, { rejectWithValue }) => {
		const { userId, query } = params;
		try {
			const response = await Request.makeGet(getReadingTargetIdAPI(userId), query);
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
		updateImgPost: [],
		isFetching: false,
		error: {},
		targetReading: [],
		renderTarget: false,
		checkRenderTarget: false,
	},
	reducers: {
		updateImg: (state, action) => {
			state.updateImgPost = action.payload;
		},
		updateTargetReading: (state, action) => {
			state.targetReading = action.payload;
		},
		renderTargetReadingProgress: (state, action) => {
			state.renderTarget = action.payload;
		},
		checkRenderTargetReading: (state, action) => {
			state.checkRenderTarget = action.payload;
		},
	},
	extraReducers: {
		[getListBooksTargetReading.pending]: state => {
			state.isFetching = true;
		},
		[getListBooksTargetReading.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.targetReading = action.payload;
			state.error = {};
		},
		[getListBooksTargetReading.rejected]: (state, action) => {
			state.isFetching = false;
			state.targetReading = [];
			state.error = action.payload;
		},
	},
});
export const { updateImg, updateTargetReading, renderTargetReadingProgress, checkRenderTargetReading } =
	chartSlice.actions;
const chart = chartSlice.reducer;
export default chart;
