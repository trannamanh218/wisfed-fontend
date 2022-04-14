import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	authAPI,
	forgotPasswordAPI,
	registerAPI,
	resetPasswordAPI,
	checkTokenResetPassword,
	forgotPasswordAPIAdmin,
	resetPasswordAPIAdmin,
} from 'constants/apiURL';
import Request from 'helpers/Request';
import Storage from 'helpers/Storage';
import _ from 'lodash';

export const register = createAsyncThunk('auth/register', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(registerAPI, params);
		return response;
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

export const checkApiToken = createAsyncThunk('/auth/forgot-admin', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(checkTokenResetPassword(params));
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

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(forgotPasswordAPI, params);
		return response;
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

export const forgotPasswordAdmin = createAsyncThunk('auth/forgotPasswordAdmin', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(forgotPasswordAPIAdmin, params);
		return response;
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(resetPasswordAPI, params);
		return response;
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

export const resetPasswordAdmin = createAsyncThunk('auth/resetPasswordAdmin', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(resetPasswordAPIAdmin, params);
		return response;
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
		infoForgot: {},
	},

	reducers: {
		updateUserInfoRedux: (state, action) => {
			state.userInfo = action.payload;
		},
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
		[register.pending]: state => {
			state.isFetching = true;
		},
		[register.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.userInfo = action.payload;
			state.error = {};
		},
		[register.rejected]: (state, action) => {
			state.isFetching = false;
			state.userInfo = {};
			state.error = action.payload;
		},
		[forgotPassword.pending]: state => {
			state.isFetching = true;
		},
		[forgotPassword.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.userInfo = action.payload;
			state.error = {};
		},
		[forgotPassword.rejected]: (state, action) => {
			state.isFetching = false;
			state.userInfo = {};
			state.error = action.payload;
		},
		[checkApiToken.pending]: state => {
			state.isFetching = true;
		},
		[checkApiToken.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.infoForgot = action.payload;
			state.error = {};
		},
		[checkApiToken.rejected]: (state, action) => {
			state.isFetching = false;
			state.error = action.payload;
			state.infoForgot = {};
		},
		[forgotPasswordAdmin.pending]: state => {
			state.isFetching = true;
		},
		[forgotPasswordAdmin.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.userInfo = action.payload;
			state.error = {};
		},
		[forgotPasswordAdmin.rejected]: (state, action) => {
			state.isFetching = false;
			state.userInfo = {};
			state.error = action.payload;
		},
	},
});

export const { updateUserInfoRedux } = authSlice.actions;
const auth = authSlice.reducer;
export default auth;
