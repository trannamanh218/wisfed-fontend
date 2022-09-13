import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Request from 'helpers/Request';
import { getPublishersAPI } from 'constants/apiURL';

export const getPublishers = createAsyncThunk('publishers/getPublisher', async (params, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(getPublishersAPI, params);
		return res.data.rows;
	} catch (err) {
		const error = err.response.message;
		return rejectWithValue(error);
	}
});

const publishersSlice = createSlice({
	name: 'publishers',
	initialState: {},
	reducers: {},
});

// export const { } = publishersSlice.actions;

const publishers = publishersSlice.reducer;
export default publishers;
