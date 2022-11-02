import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { shareTargetReadingAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const shareTargetReadings = createAsyncThunk('target/shareTarget', async (params, { rejectWithValue }) => {
	const { userId, data } = params;
	try {
		const res = await Request.makePost(shareTargetReadingAPI(userId), data);
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

const searchSlice = createSlice({
	name: 'target',
	initialState: {
		target: {},
	},
	reducers: {
		handleShareTarget: (state, action) => {
			state.target = action.payload;
		},
	},
});

export const { handleShareTarget } = searchSlice.actions;

const target = searchSlice.reducer;
export default target;
