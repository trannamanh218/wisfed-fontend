import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { listAPIChart, listBooksReadYear } from 'constants/apiURL';
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

const chartSlice = createSlice({
	name: 'chart',
	initialState: {},
});

const chart = chartSlice.reducer;
export default chart;
