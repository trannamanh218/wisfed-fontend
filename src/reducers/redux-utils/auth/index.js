import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authAPI } from 'constants/apiURL';
import Request from 'helpers/Request';
import Storage from 'helpers/Storage';
import _ from 'lodash';

export const register = createAsyncThunk('auth/register', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(params);
		return response;
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

export const login = createAsyncThunk('auth/login', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(authAPI, params);
		const { data } = response;
		if (!_.isEmpty(data)) {
			const { accessToken, refreshToken } = data.JWT;
			Request.setToken(accessToken, refreshToken);
			Storage.setAccessToken(accessToken);
			Storage.setRefreshToken(refreshToken);
			return data;
		}
		return {};
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isFetching: false,
		userInfo: {},
		error: {},
	},
	extraReducers: {
		[login.pending]: state => {
			state.isFetching = true;
		},
		[login.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.userInfo = action.payload;
			state.error = {};
		},
		[login.rejected]: (state, action) => {
			state.isFetching = false;
			state.userInfo = {};
			state.error = action.payload;
		},
	},
});

const auth = authSlice.reducer;
export default auth;
