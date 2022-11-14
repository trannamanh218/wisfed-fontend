import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	authAPI,
	forgotPasswordAPI,
	registerAPI,
	resetPasswordAPI,
	checkTokenResetPasswordAPI,
	forgotPasswordAPIAdmin,
	resetPasswordAPIAdmin,
	checkJwt,
} from 'constants/apiURL';
import Request from 'helpers/Request';
import _ from 'lodash';

export const register = createAsyncThunk('auth/register', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makePost(registerAPI, params);
		return response;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
	}
});

export const getCheckJwt = createAsyncThunk('auth/getCheckJwt', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(checkJwt, params);
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		throw rejectWithValue(error);
	}
});

export const checkTokenResetPassword = createAsyncThunk('/auth/forgot-admin', async (params, { rejectWithValue }) => {
	try {
		const response = await Request.makeGet(checkTokenResetPasswordAPI(params));
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
		return response.data;
	} catch (err) {
		const error = JSON.parse(err.response);
		return rejectWithValue(error);
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
		routerLogin: false,
		dataToResetPassword: '',
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
		updateUserInfo: (state, action) => {
			state.userInfo = action.payload;
		},
		handleDataToResetPassword: (state, action) => {
			state.dataToResetPassword = action.payload;
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
		[forgotPasswordAdmin.pending]: state => {
			state.isFetching = true;
		},
		[forgotPasswordAdmin.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.userInfo = action.payload;
			state.error = {};
		},
		[getCheckJwt.pending]: (state, action) => {
			state.isFetching = true;
			state.userInfo = {};
			state.error = action.payload;
		},
		[getCheckJwt.fulfilled]: (state, action) => {
			state.isFetching = false;
			state.userInfo = action.payload;
			state.error = {};
		},
		[getCheckJwt.rejected]: (state, action) => {
			state.isFetching = false;
			state.userInfo = {};
			state.error = action.payload;
		},
	},
});

const auth = authSlice.reducer;

export const { checkLogin, checkUserLogin, deleteUserInfo, updateUserInfo, handleDataToResetPassword } =
	authSlice.actions;

export default auth;
