// auth
export const authAPI = '/api/v1/auth';
export const registerAPI = '/api/v1/auth/register';
export const forgotPasswordAPI = '/api/v1/auth/forgotPassword';
export const resetPasswordAPI = id => `/api/v1/auth/resetPassword/${id}`;

// quote
export const quoteAPI = '/api/v1/quotes';
export const quoteDetailAPI = id => `/api/v1/quotes/${id}`;

// post
export const postAPI = '/api/v1/posts';
export const postDetailAPI = id => `/api/v1/posts/${id}`;

// group
export const groupAPI = '/api/v1/groups';
export const groupDetailAPI = id => `/api/v1/groups/${id}`;
