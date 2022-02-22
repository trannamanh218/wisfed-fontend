import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { categoryAPI, categoryDetailAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getCategoryList = createAsyncThunk('categroy/getCategoryList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(categoryAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const getDetailCategory = createAsyncThunk('categroy/getCategoryDetail', async (params, { rejectWithValue }) => {
	const { id, ...query } = params;
	try {
		const response = await Request.makeGet(categoryDetailAPI(id), query);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

const categorySlice = createSlice({
	name: 'category',
	initialState: {
		isFetching: false,
		categoriesData: {},
		error: {},
	},
});

const category = categorySlice.reducer;
export default category;
