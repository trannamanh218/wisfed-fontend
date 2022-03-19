// auth
export const authAPI = '/api/v1/auth';
export const registerAPI = '/api/v1/auth/register';
export const forgotPasswordAPI = '/api/v1/auth/forgotPassword';
export const resetPasswordAPI = id => `/api/v1/auth/resetPassword/${id}`;

// quote
export const quoteAPI = '/api/v1/quotes';
export const quoteDetailAPI = id => `/api/v1/quotes/${id}`;
export const quoteCommentAPI = '/api/v1/commentQuotes';
export const likeQuoteAPI = id => `/api/v1/quotes/like/${id}`;

// post
export const postAPI = '/api/v1/posts';
export const postDetailAPI = id => `/api/v1/posts/${id}`;
export const previewLink = '/api/v1/preview/demo';

// group
export const groupAPI = '/api/v1/groups';
export const groupDetailAPI = id => `/api/v1/groups/${id}`;

// books
export const bookAPI = '/api/v1/books';
export const bookDetailAPI = id => `/api/v1/books/${id}`;
export const bookElasticSearchAPI = '/api/v1/books/search';
export const creatBookCopyrightsAPI = '/api/v1/bookCopyrights';
export const bookAllReviewAPI = id => `/api/v1/books/${id}/reviews`;
export const bookFollowReviewAPi = id => `/api/v1/books/${id}/followReviews`;
export const bookFriendReviewAPi = id => `/api/v1/books/${id}/friendReviews`;

// category
export const categoryAPI = '/api/v1/categories';
export const categoryDetailAPI = id => `/api/v1/categories/${id}`;

//user
export const userAPI = '/api/v1/users';
export const userDetailAPI = id => `/api/v1/users/${id}`;
export const checkLikedAPI = '/api/v1/users/checkLiked';
export const viewUserProfile = id => `/api/v1/users/${id}/viewProfile`;

// friend
export const friendAPI = id => `/api/v1/users/${id}/listFriend`;
export const makeFriendAPI = `/api/v1/users/friendRequest`;

//activity
export const activityAPI = '/api/v1/getstream';
export const likeActivityAPI = '/api/v1/getstream/like';
export const listLikedActivityAPI = '/api/v1/users/likedActivities';

// upload files
export const uploadImageAPI = '/api/v1/upload/image';
export const uploadMultipleImageAPI = '/api/v1/upload/multiple';

// library
export const libraryAPI = '/api/v1/libraries';
export const libraryDetailAPI = id => `/api/v1/libraries/${id}`;
export const addBookToLibraryAPI = id => `/api/v1/libraries/${id}/addBook`;
export const removeBookFromLibraryAPI = id => `/api/v1/libraries/${id}/removeBook`;

// comment activity
export const commentActivityAPI = '/api/v1/commentActivities';
export const commentActivityDetailAPI = id => `/api/v1/commentActivities/${id}`;
