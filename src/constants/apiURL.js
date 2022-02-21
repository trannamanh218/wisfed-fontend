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

// books
export const bookAPI = '/api/v1/books';
export const bookDetailAPI = id => `/api/v1/books/${id}`;
export const bookElasticSearchAPI = '/api/v1/books/search';

// category
export const categoryAPI = '/api/v1/categories';
export const categoryDetailAPI = id => `/api/v1/categories/${id}`;

//user
export const userAPI = '/api/v1/users';
export const userDetailAPI = id => `/api/v1/users/${id}`;

// friend
export const friendAPI = id => `/api/v1/users/${id}/listFriend`;
export const makeFriendAPI = `/api/v1/users/friendRequest`;

//activity
export const activityAPI = '/api/v1/getstream';

// upload
export const uploadImageAPI = '/api/v1/upload/image';
export const uploadMultipleImageAPI = '/api/v1/upload/multiple';
