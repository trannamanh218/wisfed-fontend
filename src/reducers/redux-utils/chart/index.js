import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { listAPIChart, listBooksReadYear, getReadingTargetAPI, updateTargetReadAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getListChart = createAsyncThunk('chart/apiChart', async (params, { rejectWithValue }) => {
	const { count, by } = params;
	try {
		const response = await Request.makeGet(listAPIChart(count, by));
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const getListBooksReadYear = createAsyncThunk(
	'chart/getListBooksReadYear',
	async (params, { rejectWithValue }) => {
		const { type } = params;
		try {
			const response = await Request.makeGet(listBooksReadYear(type));
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
		try {
			const response = await Request.makeGet(getReadingTargetAPI, params);
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
	initialState: {},
});

const chart = chartSlice.reducer;
export default chart;
