import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	addBookToLibraryAPI,
	libraryAPI,
	listBookLibraryAPI,
	removeBookFromLibraryAPI,
	updateBookAPI,
} from 'constants/apiURL';
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
		const response = await Request.makePost(addBookToLibraryAPI(id), data);
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

export const updateProgressReadingBook = createAsyncThunk(
	'library/updateProgressReadingBook',
	async (params, { rejectWithValue }) => {
		const { id, ...data } = params;
		try {
			const response = await Request.makePatch(updateBookAPI(id), data);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const removeBookFromLibrary = createAsyncThunk(
	'library/updateProgressReadingBook',
	async (params, { rejectWithValue }) => {
		const { id, ...data } = params;
		try {
			const response = await Request.makePost(removeBookFromLibraryAPI(id), data);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

// export const checkBookInLibrary = createAsyncThunk(
// 	'library/checkBookInLibrary',
// 	async (params, { dispatch, rejectWithValue }) => {
// 		try {
// 			const res = await dispatch(getListBookLibrary(params)).unwrap();
// 			const { rows } = res;
// 			if (rows && rows.length) {
// 				// const library = {}
// 				const libraryList = rows.map(library => ({}));
// 			}
// 			console.log(res);
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}
// );

const librarySlice = createSlice({
	name: 'library',
	initialState: {
		isFetching: false,
		libraryData: {
			rows: [],
			count: 0,
		},
		otherLibraryData: {
			rows: [],
			count: 0,
		},
		error: {},
	},
	reducers: {
		updateAuthLibrary: (state, action) => {
			const { rows, count } = action.payload;
			state.libraryData = { rows, count };
		},
		updateOtherLibrary: (state, action) => {
			const { rows, count } = action.payload;
			state.otherLibraryData = { rows, count };
		},
	},
	extraReducers: {
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
		[removeBookFromLibrary.pending]: state => {
			state.isFetching = true;
		},
		[removeBookFromLibrary.fulfilled]: (state, action) => {
			state.isFetching = false;
			const index = state.libraryData.rows.findIndex(item => item.id === action.payload.id);
			const newData = [...state.libraryData.rows];
			if (index !== -1) {
				newData[index] = action.payload;
			}

			state.libraryData = { ...state.libraryData, rows: newData };
			state.error = {};
		},
		[removeBookFromLibrary.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
	},
});

const library = librarySlice.reducer;
export default library;
export const { updateAuthLibrary, updateOtherLibrary } = librarySlice.actions;
