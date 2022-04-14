// auth
export const authAPI = '/api/v1/auth';
export const registerAPI = '/api/v1/auth/register';
export const forgotPasswordAPI = '/api/v1/auth/forgotPassword';
export const forgotPasswordAPIAdmin = '/api/v1/auth/adminForgotPassword/';
export const resetPasswordAPI = '/api/v1/auth/resetPassword/';
export const resetPasswordAPIAdmin = '/api/v1/auth/resetPasswordByMail/';
export const checkTokenResetPassword = token => `/api/v1/auth/verify-password?token=${token}`;

// quote
export const quoteAPI = '/api/v1/quotes';
export const quoteDetailAPI = id => `/api/v1/quotes/${id}`;
export const quoteCommentAPI = '/api/v1/commentQuotes';
export const likeQuoteAPI = id => `/api/v1/quotes/like/${id}`;
export const checkLikeQuoteAPI = '/api/v1/quotes/checkLikeQuote';
export const likeQuoteCommentAPI = id => `/api/v1/commentQuotes/like/${id}`;
export const checkLikeQuoteCommentAPI = '/api/v1/quotes/checkLikeCmtQuote';

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
export const bookCopyrightsAPI = '/api/v1/bookCopyrights';
export const bookAllReviewAPI = id => `/api/v1/books/${id}/reviews`;
export const bookFollowReviewAPi = id => `/api/v1/books/${id}/followReviews`;
export const bookFriendReviewAPi = id => `/api/v1/books/${id}/friendReviews`;
export const progressBookAPI = id => `/api/v1/books/updateBookProgress/${id}`;

// category
export const categoryAPI = '/api/v1/categories';
export const categoryDetailAPI = id => `/api/v1/categories/${id}`;
export const favoriteCategoriesAPI = '/api/v1/categories/favoriteCategories';

//user
export const userAPI = '/api/v1/users';
export const userDetailAPI = id => `/api/v1/users/${id}`;
export const checkLikedAPI = '/api/v1/users/checkLiked';
export const updateLikeCategory = id => `api/v1/users/${id}`;

// friend
export const friendAPI = id => `/api/v1/users/listFriends/${id}`;
export const cancelFriendApi = id => `/api/v1/users/${id}/cancelFriendReq`;
export const makeFriendAPI = `/api/v1/users/friendRequest`;
export const replyFriendReqApi = id => `/api/v1/users/${id}/replyFriendReq/`;
export const unFriend = id => `/api/v1/users/${id}/unFriend`;
export const myFriendsReq = `/api/v1/users/friendReqToMe/`;
//activity
export const activityAPI = '/api/v1/getstream';
export const likeActivityAPI = id => `/api/v1/getstream/like/${id}`;
export const listLikedActivityAPI = '/api/v1/users/likedActivities';

// upload files
export const uploadImageAPI = '/api/v1/upload/image';
export const uploadMultipleImageAPI = '/api/v1/upload/multiple';

// library
export const libraryAPI = '/api/v1/libraries';
export const libraryDetailAPI = id => `/api/v1/libraries/${id}`;
export const addBookToLibraryAPI = id => `/api/v1/libraries/${id}/addBook`;
export const removeBookFromLibraryAPI = id => `/api/v1/libraries/${id}/removeBook`;
export const listBookLibraryAPI = id => `/api/v1/libraries/listBookLibrary/${id}`;
export const updateBookAPI = id => `api/v1/libraries/updateBookLibrary/${id}`;
export const myLibraryAPI = '/api/v1/libraries/mylib';
export const addBookToDefaultLibraryAPI = type => `/api/v1/libraries/addBook/${type}`;
export const allBookInLibraryAPI = id => `/api/v1/libraries/listBookAllLibrary/${id}`;
export const removeAllBookAPI = '/api/v1/libraries/removeAllBook ';
export const addRemoveBookAPI = id => `/api/v1/libraries/addRemoveBook/${id}`;
export const checkBookLibraryAPI = id => `/api/v1/libraries/checkBookLibrary/${id}`;
export const otherListBookInLibaries = id => `/api/v1/libraries/listBookBy/${id}`;

// comment activity
export const commentActivityAPI = '/api/v1/commentMiniposts';
export const commentActivityDetailAPI = id => `/api/v1/commentMiniposts/${id}`;

// notification
export const nottificationAPI = '/api/v1/getstream/notiMention';
// followrs
export const listFolowrs = id => `/api/v1/users/listFollowers/${id}`;
export const addfollow = '/api/v1/users/follow';
export const unFollow = id => `/api/v1/users/${id}/unFollow`;
export const listFollowing = id => `/api/v1/users/listFollowings/${id}`;
