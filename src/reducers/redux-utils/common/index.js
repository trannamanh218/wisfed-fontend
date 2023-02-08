import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	uploadImageAPI,
	uploadMultipleImageAPI,
	bookCopyrightsAPI,
	getlistContactByGg,
	bookCopyrightsTranslatorAPI,
	bookCopyrightsAuthorAPI,
} from 'constants/apiURL';
import Request from 'helpers/Request';

export const uploadImage = createAsyncThunk('common/uploadImage', async (dataUpload, { rejectWithValue }) => {
	try {
		const response = await Request.makeUpload(uploadImageAPI, dataUpload);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const uploadMultiFile = createAsyncThunk('common/uploadMultiFile', async (dataUpload, { rejectWithValue }) => {
	try {
		const res = await Request.makeUpload(uploadMultipleImageAPI, dataUpload);
		const data = res.data;
		return data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const creatBookCopyrights = createAsyncThunk(
	'common/creatBookCopyrights',
	async (dataCopyrights, { rejectWithValue }) => {
		try {
			const res = await Request.makePost(bookCopyrightsAPI, dataCopyrights);
			const data = res.data;
			return data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const creatBookCopyrightsAuthor = createAsyncThunk(
	'common/creatBookCopyrightsTranslator',
	async (dataCopyrights, { rejectWithValue }) => {
		try {
			const res = await Request.makePost(bookCopyrightsAuthorAPI(dataCopyrights?.bookId), dataCopyrights);
			const data = res.data;
			return data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const creatBookCopyrightsTranslator = createAsyncThunk(
	'common/creatBookCopyrightsTranslator',
	async (dataCopyrights, { rejectWithValue }) => {
		try {
			const res = await Request.makePost(bookCopyrightsTranslatorAPI(dataCopyrights?.bookId), dataCopyrights);
			const data = res.data;
			return data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

export const getListCopyrights = createAsyncThunk('common/getListCopyrights', async (params, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(bookCopyrightsAPI, params);
		const data = res.data;
		return data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getListContactGoogle = createAsyncThunk(
	'common/get list contact google',
	async (code, { rejectWithValue }) => {
		try {
			const res = await Request.makeGet(getlistContactByGg(code));
			return res.data;
		} catch (err) {
			const error = JSON.parse(err.response);
			return rejectWithValue(error);
		}
	}
);

const commonSlice = createSlice({
	name: 'common',
	initialState: {
		titleReviewPage: '',
		optionAddToPost: {},
	},

	reducers: {
		updateTitleReviewPage: (state, action) => {
			state.titleReviewPage = action.payload;
		},
		setOptionAddToPost: (state, action) => {
			state.optionAddToPost = action.payload;
		},
	},
});

export const { updateTitleReviewPage, setOptionAddToPost } = commonSlice.actions;
export default commonSlice.reducer;
