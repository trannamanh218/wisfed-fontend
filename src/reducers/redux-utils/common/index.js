import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImageAPI, uploadMultipleImageAPI } from 'constants/apiURL';
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
		console.log('data', data);
	} catch (err) {
		const error = err.response;
		return error;
	}
});
