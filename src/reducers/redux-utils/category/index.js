import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { categoryAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getCategoryList = createAsyncThunk('book/getBookList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(categoryAPI, params);
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
