import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImageAPI, uploadMultipleImageAPI, creatBookCopyrightsAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const uploadImage = createAsyncThunk('common/uploadImage', async (params, { rejectWithValue }) => {
	const {
		data: { file },
	} = params;

	try {
		const response = await Request.makeUpload(uploadImageAPI, file, params);
		return response.data;
	} catch (err) {
		const error = JSON.stringify(err.response);
		throw rejectWithValue(error);
	}
});

export const uploadMultiFile = createAsyncThunk('common/uploadMultiFile', async dataUpload => {
	try {
		const res = await Request.makeUpload(uploadMultipleImageAPI, dataUpload);
		const data = res.data;
		return data;
	} catch (err) {
		const error = err.response;
		return error;
	}
});

export const creatBookCopyrights = createAsyncThunk(
	'common/creatBookCopyrights',
	async (dataCopyrights, { rejectWithValue }) => {
		try {
			const res = await Request.makePost(creatBookCopyrightsAPI, dataCopyrights);
			const data = res.data;
			return data;
		} catch (err) {
			const error = err.response.message;
			return rejectWithValue(error);
		}
	}
);
