import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImageAPI, uploadMultipleImageAPI, creatBookCopyrightsAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const uploadImage = createAsyncThunk('common/uploadImage', async params => {
	const {
		data: { file },
	} = params;

	try {
		const response = await Request.makeUpload(uploadImageAPI, file, params);
		console.log(response.data);
		return response.data;
	} catch (err) {
		console.log(err);
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
