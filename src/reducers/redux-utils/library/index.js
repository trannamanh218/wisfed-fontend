import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { libraryAPI, listBookLibraryAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const createLibrary = createAsyncThunk('library/createLibrary', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(libraryAPI, params);
		return { ...response.data, books: [] };
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

export const addBookToLibrary = createAsyncThunk('library/addBookToLibrary', async (params, { rejectWithValue }) => {
	const { id, ...data } = params;
	try {
		const response = await Request.makePost(addBookToLibrary(id), data);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getListBookLibrary = createAsyncThunk(
	'library/getListBookLibrary',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makeGet(listBookLibraryAPI, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

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
		[createLibrary.pending]: state => {
			state.isFetching = true;
		},
		[createLibrary.fulfilled]: (state, action) => {
			state.isFetching = false;
			const newData = [...state.libraryData.rows, action.payload];
			state.libraryData = { rows: newData, count: newData.length };
			state.error = {};
		},
		[createLibrary.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
	},
});

const library = librarySlice.reducer;
export default library;
