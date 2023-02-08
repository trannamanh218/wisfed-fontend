import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	categoryAPI,
	categoryDetailAPI,
	favoriteCategoriesAPI,
	listBookByCategoryAPI,
	postByCategoryAPI,
} from 'constants/apiURL';
import Request from 'helpers/Request';

export const getCategoryList = createAsyncThunk('categroy/getCategoryList', async (data, { rejectWithValue }) => {
	const { option, params } = data;
	try {
		const response = await Request.makeGet(categoryAPI(option), params);
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

export const getFavoriteCategories = createAsyncThunk(
	'category/getFavoriteCategories',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makeGet(favoriteCategoriesAPI, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const getListBookByCategory = createAsyncThunk(
	'category/get books by category',
	async (data, { rejectWithValue }) => {
		try {
			const { categoryId, params } = data;
			const response = await Request.makeGet(listBookByCategoryAPI(categoryId), params);
			return response.data.rows;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

export const getPostsByCategory = createAsyncThunk(
	'category/get posts by category',
	async (data, { rejectWithValue }) => {
		try {
			const { categoryId, params } = data;
			const response = await Request.makeGet(postByCategoryAPI(categoryId), params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			throw rejectWithValue(error);
		}
	}
);

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
		updateCategoryInfoIsLike: (state, action) => {
			state.categoryInfo = { ...state.categoryInfo, isFavorite: action.payload };
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
export const { updateAllCategoryData, updateCategoryInfoIsLike } = categorySlice.actions;
export default category;
