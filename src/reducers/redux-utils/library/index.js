import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { libraryAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const createLibrary = createAsyncThunk('library/createLibrary', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(libraryAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getLibraryList = createAsyncThunk('library/getLibraryList', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(libraryAPI, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

const librarySlice = createSlice({
	name: 'library',
	initialState: {
		isFetching: false,
		libraryData: {
			rows: [],
			count: 0,
		},
		error: {},
	},
	extraReducers: {
		[getLibraryList.pending]: state => {
			state.isFetching = true;
		},
		[getLibraryList.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.libraryData = action.payload;
			state.error = {};
		},
		[getLibraryList.rejected]: (state, action) => {
			state.isFetching = false;
			state.libraryData = {};
			state.error = action.payload;
		},
	},
});

const library = librarySlice.reducer;
export default library;
