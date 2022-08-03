import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Request from 'helpers/Request';
import { getMySeriesAPI, getListBookBySeriesAPI, getSeriesDetailAPI, postMoreSeriesAPI } from 'constants/apiURL';

export const getMySeries = createAsyncThunk('series/getMySeries', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(getMySeriesAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getListBookBySeries = createAsyncThunk(
	'series/getListBookBySeries',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makeGet(getListBookBySeriesAPI, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getSeriesDetail = createAsyncThunk('series/getSeriesDetail', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(getSeriesDetailAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const postMoreSeries = createAsyncThunk('series/postMoreSeries', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(postMoreSeriesAPI, params);
		return {
			...response.data,
		};
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

const seriesSlice = createSlice({
	name: 'series',
	initialState: {
		isFetching: false,
		mySeries: [],
	},
	reducers: {
		getMySeriesRedux: (state, action) => {
			state.mySeries = action.payload;
		},
	},
	// extraReducers: {
	// 	[getSeries.pending]: state => {
	// 		state.isFetching = true;
	// 	},
	// },
});

export const { getMySeriesRedux } = seriesSlice.actions;

const seriesReducer = seriesSlice.reducer;
export default seriesReducer;
