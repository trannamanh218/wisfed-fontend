import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	addBookToDefaultLibraryAPI,
	addBookToLibraryAPI,
	addRemoveBookAPI,
	allBookInLibraryAPI,
	checkBookLibraryAPI,
	libraryAPI,
	listBookLibraryAPI,
	allLibraryListAPI,
	removeAllBookAPI,
	removeBookFromLibraryAPI,
	libraryDetailAPI,
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

export const getAllLibraryList = createAsyncThunk('library/getLibraryList', async (data, { rejectWithValue }) => {
	const { userId, params } = data;
	try {
		const response = await Request.makeGet(allLibraryListAPI(userId), params);
		return response.data.rows;
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

export const addBookToDefaultLibrary = createAsyncThunk(
	'library/addBookToDefaultLibrary',
	async (params, { rejectWithValue }) => {
		const { type, ...data } = params;
		try {
			const response = await Request.makePost(addBookToDefaultLibraryAPI(type), data);
			return {
				...response.data,
				type,
			};
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getAllBooksInLibraries = createAsyncThunk(
	'library/getAllBooksInLibraries',
	async (params, { rejectWithValue }) => {
		const { id, ...data } = params;
		if (id) {
			try {
				const response = await Request.makeGet(allBookInLibraryAPI(id), data);
				return response.data;
			} catch (err) {
				const error = JSON.parse(err.response);
				return rejectWithValue(error);
			}
		}
		return {};
	}
);

export const getListBookLibrary = createAsyncThunk(
	'library/getListBookLibrary',
	async (params, { rejectWithValue }) => {
		const { id, ...query } = params;
		try {
			const response = await Request.makeGet(listBookLibraryAPI(id), query);
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

export const removeBookInLibraries = createAsyncThunk(
	'library/removeBookInLibraries',
	async (params, { rejectWithValue }) => {
		try {
			const response = await Request.makePost(removeAllBookAPI, params);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const addRemoveBookInLibraries = createAsyncThunk(
	'library/addRemoveBookInLibrary',
	async (params, { rejectWithValue }) => {
		const { id, data } = params;
		try {
			const response = await Request.makePost(addRemoveBookAPI(id), data);
			return response.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const checkBookInLibraries = createAsyncThunk('library/checkBookInLibrarie', async (id, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(checkBookLibraryAPI(id));
		return response.data.rows;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const updateLibrary = createAsyncThunk('library/updateLibrary', async (params, { rejectWithValue }) => {
	const { id, data } = params;
	try {
		const response = await Request.makePatch(libraryDetailAPI(id), data);
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
		authLibraryData: {
			rows: [],
			count: 0,
		},
		error: {},
		myAllLibrary: {},
		updateMyLibrary: false,
		defaultLibraryRedux: {},
	},

	reducers: {
		updateAuthLibrary: (state, action) => {
			state.authLibraryData = action.payload;
		},
		setAllMyLibraryRedux: (state, action) => {
			state.myAllLibrary = action.payload;
		},
		updateMyAllLibraryRedux: state => {
			state.updateMyLibrary = !state.updateMyLibrary;
		},
		handleSetDefaultLibrary: (state, action) => {
			state.defaultLibraryRedux = action.payload;
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
		[addBookToDefaultLibrary.pending]: state => {
			state.isFetching = true;
		},
		[addBookToDefaultLibrary.fulfilled]: state => {
			state.isFetching = false;
		},
		[addBookToDefaultLibrary.rejected]: state => {
			state.isFetching = false;
		},
	},
});

const library = librarySlice.reducer;
export default library;
export const { updateAuthLibrary, setAllMyLibraryRedux, updateMyAllLibraryRedux, handleSetDefaultLibrary } =
	librarySlice.actions;
