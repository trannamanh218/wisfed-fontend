import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImageAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const uploadImage = createAsyncThunk('common/uploadImage', async params => {
	const {
		data: { file },
	} = params;

	try {
		const response = await Request.makeUpload(uploadImageAPI, file, params);

		return response.data;
	} catch (err) {
		console.log(err);
	}
});
