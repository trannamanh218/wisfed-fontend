import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { listAPIChart } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getListChart = createAsyncThunk('apiChart', async (params, { rejectWithValue }) => {
	const { count, by } = params;
	try {
		const response = await Request.makeGet(listAPIChart(count, by));
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

const chartSlice = createSlice({
	name: 'chart',
	initialState: {},
});

const chart = chartSlice.reducer;
export default chart;
