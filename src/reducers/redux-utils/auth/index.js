import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { action } from '@storybook/addon-actions';
import {
	authAPI,
	forgotPasswordAPI,
	registerAPI,
	resetPasswordAPI,
	checkTokenResetPassword,
	forgotPasswordAPIAdmin,
	resetPasswordAPIAdmin,
	InforUserByEmail,
	checkJwt,
} from 'constants/apiURL';
import Request from 'helpers/Request';
import Storage from 'helpers/Storage';
import _ from 'lodash';
import jwtDecode from 'jwt-decode';

export const register = createAsyncThunk('auth/register', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(registerAPI, params);
		return response;
	} catch (err) {
		return rejectWithValue(err.response);
	}
});

export const getCheckJwt = createAsyncThunk('user/getCheckJwt', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(checkJwt, params);
		return response;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
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

export const getUserInfo = createAsyncThunk('auth/getUserInfo', async () => {
	const accessToken = localStorage.getItem('accessToken');
	const { email } = jwtDecode(accessToken);
	if (accessToken !== null) {
		const response = await Request.makeGet(InforUserByEmail(email));
		return response.data;
	} else {
		return {};
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
		isAuth: null,
		userInfo: {},
		error: {},
		infoForgot: {},
		routerLogin: false,
	},
	reducers: {
		checkLogin: (state, action) => {
			state.isAuth = action.payload;
		},
		checkUserLogin: (state, action) => {
			state.routerLogin = action.payload;
		},
		deleteUserInfo: state => {
			state.userInfo = {};
		},
		checkUserInfor: (state, action) => {
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
		[checkJwt.pending]: state => {
			state.isFetching = true;
		},
		[checkJwt.fulfilled]: (state, action) => {
			state.isFetching = false;

			state.userInfo = action.payload;
			state.error = {};
		},
		[checkJwt.rejected]: (state, action) => {
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
		[getUserInfo.rejected]: (state, action) => {
			state.isFetching = false;
			state.userInfo = {};
			state.error = action.payload;
		},
		[getUserInfo.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.userInfo = action.payload;
			state.error = {};
		},
		[getUserInfo.rejected]: (state, action) => {
			state.isFetching = false;

			state.userInfo = {};
			state.error = action.payload;
		},
	},
});

const auth = authSlice.reducer;
export const { checkLogin, checkUserLogin, deleteUserInfo, checkUserInfor } = authSlice.actions;
export default auth;
