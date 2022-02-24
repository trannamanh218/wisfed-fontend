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

export const getCategoryDetail = createAsyncThunk('categroy/getCategoryDetail', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(categoryDetailAPI(id), {});
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
		categoriesData: {
			rows: [],
			count: 0,
		},
		categoryInfo: {},
		error: {},
	},
	reducers: {
		updateAllCategoryData: (state, action) => {
			state.categoriesData = action.payload;
		},
	},
	extraReducers: {
		[getCategoryDetail.pending]: state => {
			state.isFetching = true;
		},
		[getCategoryDetail.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.categoryInfo = action.payload;
			state.error = {};
		},
		[getCategoryDetail.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
	},
});

const category = categorySlice.reducer;
export const { updateAllCategoryData } = categorySlice.actions;
export default category;
