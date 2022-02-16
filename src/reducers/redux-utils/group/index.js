import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { groupAPI } from 'constants/apiURL';
import Request from 'helpers/Request';

export const getGroupList = createAsyncThunk('group/getGroupList', async (params = {}, { rejectWithValue }) => {
	try {
		const res = await Request.makeGet(groupAPI, params);
		return res.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

const groupSlice = createSlice({
	name: 'group',
	initialState: {
		isFetching: false,
		groupsData: {},
		error: {},
	},
	extraReducers: {
		[getGroupList.pending]: state => {
			state.isFetching = true;
		},
		[getGroupList.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.groupsData = action.payload;
		},
		[getGroupList.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
		},
	},
});

const group = groupSlice.reducer;
export default group;
