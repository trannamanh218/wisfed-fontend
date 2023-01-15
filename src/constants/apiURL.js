// auth
export const authAPI = '/api/v1/auth';
export const registerAPI = '/api/v1/auth/register';
export const forgotPasswordAPI = '/api/v1/auth/forgotPassword';
export const forgotPasswordAPIAdmin = '/api/v1/auth/adminForgotPassword/';
export const resetPasswordAPI = '/api/v1/auth/resetPassword/';
export const resetPasswordAPIAdmin = '/api/v1/auth/resetPasswordByMail/';
export const checkTokenResetPasswordAPI = token => `/api/v1/auth/verify-password?token=${token}`;
export const checkJwt = '/api/v1/auth/jwt';

// quote
export const quoteAPI = '/api/v1/quotes';
export const quoteDetailAPI = id => `/api/v1/quotes/${id}`;
export const quoteCommentAPI = '/api/v1/commentQuotes';
export const likeQuoteAPI = id => `/api/v1/quotes/like/${id}`;
export const likeQuoteCommentAPI = id => `/api/v1/commentQuotes/like/${id}`;
export const getMyLikedQuotesAPI = '/api/v1/quotes/listQuotesLiked';
export const getQuotesByFriendsOrFollowersAPI = '/api/v1/quotes/listQuotesRelation';
export const countQuotesByCategoryWithUserIdAPI = id => `/api/v1/quotes/countQuotes/${id}`;
export const countAllQuotesByCategorydAPI = '/api/v1/quotes/countQuotes';
export const getQuoteCommentsAPI = id => `/api/v1/quotes/listCommentQuote/${id}/`;
export const listQuotesLikedByIdAPI = id => `/api/v1/quotes/listQuotesLikedById/${id}`;
export const listHasgTagByUserAPI = '/api/v1/tags';
export const listQuotesByTagAPI = '/api/v1/quotes/listQuoteByTag';
export const listHashtagsOfUserQuotesAPI = id => `/api/v1/quotes/hashtag/${id}`;

// post
export const postAPI = '/api/v1/posts';
export const postDetailAPI = id => `/api/v1/posts/${id}`;
export const previewLink = '/api/v1/preview/demo';
export const likeCommentPostAPI = id => `/api/v1/commentMiniposts/like/${id}`;
export const getMiniPostCommentsAPI = id => `/api/v1/getstream/listCommentMiniPost/${id}`;
export const getGroupPostCommentsAPI = id => `/api/v1/groups/listCommentPost/${id}`;
export const deleteMiniPostAPI = id => `/api/v1/getstream/${id}`;

// books
export const bookAPI = '/api/v1/books';
export const bookDetailAPI = id => `/api/v1/books/${id}`;
export const bookElasticSearchAPI = '/api/v1/books/search';
export const bookCopyrightsAPI = '/api/v1/bookCopyrights';
export const bookReviewAPI = '/api/v1/reviews';
export const listReviewByBookIdAPI = bookId => `/api/v1/reviews/listReviewBook/${bookId}`;
export const listCommentsReviewAPI = reviewId => `/api/v1/reviews/listCommentReview/${reviewId}`;
export const likeReviewsAPI = reviewId => `/api/v1/reviews/like/${reviewId}`;
export const likeCommentReviewsAPI = id => `/api/v1/commentReviews/like/${id}`;
export const commentBookReviewAPI = '/api/v1/commentReviews';
export const bookFollowReviewAPI = id => `/api/v1/books/${id}/followReviews`;
export const bookFriendReviewAPI = id => `/api/v1/books/${id}/friendReviews`;
export const progressBookAPI = id => `/api/v1/books/updateBookProgress/${id}`;
export const bookAuthorAPI = id => `/api/v1/books/listBookByAuthor/${id}`;
export const editReviewBookAPI = id => `/api/v1/reviews/${id}`;

// category
export const categoryAPI = option => `/api/v1/categories?include=${option}`;
export const categoryDetailAPI = id => `/api/v1/categories/${id}`;
export const favoriteCategoriesAPI = '/api/v1/categories/favoriteCategories';
export const listBookByCategoryAPI = categoryId => `/api/v1/books/listBookCategory/${categoryId}`;
export const postByCategoryAPI = categoryId => `/api/v1/getstream/listPostByCategory/${categoryId}`;

// rating
export const bookRating = id => `/api/v1/books/ratingBook/${id}`;
export const userRating = id => `api/v1/books/rating/${id}`;

// user
export const userAPI = '/api/v1/users';
export const userDetailAPI = id => `/api/v1/users/${id}`;
export const checkUserInfoAPI = '/api/v1/auth/jwt';
export const getFavoriteAuthorAPI = id => `/api/v1/users/listAuthorsLiked/${id}`;
export const userUpdateAPI = `/api/v1/users/update`;

// friend
export const friendAPI = id => `/api/v1/users/listFriends/${id}`;
export const cancelFriendApi = id => `/api/v1/users/${id}/cancelFriendReq`;
export const makeFriendAPI = `/api/v1/users/friendRequest`;
export const replyFriendReqApi = id => `/api/v1/users/${id}/replyFriendReq/`;
export const unFriend = id => `/api/v1/users/${id}/unFriend`;
export const myFriendsReq = `/api/v1/users/friendReqToMe`;
export const recommendFriendAPI = '/api/v1/users/recommendFriends';

//activity
export const activityAPI = '/api/v1/getstream';
export const likeActivityAPI = id => `/api/v1/getstream/like/${id}`;
export const getPostsByUserAPI = id => `/api/v1/getstream/profile/${id}`;

// upload files
export const uploadImageAPI = '/api/v1/upload';
export const uploadMultipleImageAPI = '/api/v1/upload/multiple';

// library
export const libraryAPI = '/api/v1/libraries';
export const libraryDetailAPI = id => `/api/v1/libraries/${id}`;
export const addBookToLibraryAPI = id => `/api/v1/libraries/${id}/addBook`;
export const removeBookFromLibraryAPI = id => `/api/v1/libraries/${id}/removeBook`;
export const listBookLibraryAPI = id => `/api/v1/libraries/listBookLibrary/${id}`;
export const updateBookAPI = id => `api/v1/libraries/updateBookLibrary/${id}`;
export const allLibraryListAPI = id => `/api/v1/libraries/libraryBy/${id}`;
export const addBookToDefaultLibraryAPI = type => `/api/v1/libraries/addBook/${type}`;
export const allBookInLibraryAPI = id => `/api/v1/libraries/listBookAllLibrary/${id}`;
export const removeAllBookAPI = '/api/v1/libraries/removeAllBook ';
export const addRemoveBookAPI = id => `/api/v1/libraries/addRemoveBook/${id}`;
export const checkBookLibraryAPI = id => `/api/v1/libraries/checkBookLibrary/${id}`;
export const otherListBookInLibaries = id => `/api/v1/libraries/listBookBy/${id}`;

// comment activity
export const commentActivityAPI = '/api/v1/commentMiniposts';
export const commentActivityDetailAPI = id => `/api/v1/commentMiniposts/${id}`;
export const commentActivityGroupPostAPI = id => `/api/v1/groupPosts/commentGroupPost/${id}`;
export const commentActivityReviewAPI = id => `/api/v1/commentReviews/${id}`;
export const commentActivityQuoteAPI = id => `/api/v1/commentQuotes/${id}`;

// notification
export const nottificationAPI = '/api/v1/getstream/notifications';
export const postReadNotification = `/api/v1/getstream/readNotification`;
export const notificationUnRead = `/api/v1/getstream/unreadNotifications`;

// followrs
export const listFolowrs = id => `/api/v1/users/listFollowers/${id}`;
export const addfollow = '/api/v1/users/follow';
export const unFollow = id => `/api/v1/users/${id}/unFollow`;
export const listFollowing = id => `/api/v1/users/listFollowings/${id}`;

// hashtag
export const listPostByHashtagAPI = '/api/v1/searchs/tags';
export const listPostByHashTagGroupAPI = id => `/api/v1/groups/searchTag/${id}`;

// export const listAPIChart = (count, by) => `/api/v1/tracking?count=${count}&by=${by}`;
export const listBooksReadYear = (type, id) => `/api/v1/libraries/listBookByType/${type}/${id}`;
export const getAPIchartsByid = (id, count, by) => `/api/v1/report/reportBooksById/${id}?count=${count}&by=${by}`;

// reading-target
export const getReadingTargetAPI = '/api/v1/books/readingGoal';
export const updateTargetReadAPI = year => `/api/v1/books/readingGoal/${year}`;
export const getReadingTargetIdAPI = id => `/api/v1/books/readingGoalById/${id}`;

// ranks
export const getTopQuotesAPI = `/api/v1/report/reportTopQuotes`;
export const getTopBooksAPI = `/api/v1/report/reportTopBooks`;
export const getFilterTopUserAPI = `/api/v1/report/reportTopUsers`;
export const getBooksChartsData = id => `/api/v1/report/growthChartBook/${id}`;

// group
export const groupDetailAPI = id => `/api/v1/groups/${id}`;
export const groupAPI = '/api/v1/groups';
export const myGroup = '/api/v1/groups/myGroup';
export const adminGroup = '/api/v1/groups/myGroup?type=admin';
export const memberGroup = id => `/api/v1/groups/memberGroup/${id}`;
export const listTagGroup = id => `/api/v1/groups/countTag/${id}`;
export const commentGroup = '/api/v1/groupPosts/commentGroupPost';
export const likeGroupPost = id => `/api/v1/groupPosts/like/${id}`;
export const likeCommentGroupAPI = id => `/api/v1/groupPosts/likeComment/${id}`;
export const inviteFriend = id => `api/v1/groups/inviteMemberToGroup/${id}`;
export const enjoyGroup = id => `/api/v1/groups/requestGroup/${id}`;
export const leaveGroup = id => `/api/v1/groups/leaveGroup/${id}`;
export const createPostGroup = id => `/api/v1/groups/${id}/createPost`;
export const listPostGroup = id => `/api/v1/groups/${id}/groupFeed`;
export const searchGroup = id => `/api/v1/groups/search/${id}`;
export const unFollowGroupAPI = id => `/api/v1/groups/unFollow/${id}`;
export const followGroupAPI = id => `/api/v1/groups/follow/${id}`;
export const recommendGroup = '/api/v1/groups/recommendGroup';
export const replyInviteGroupAPI = id => `/api/v1/groups/replyInvite/${id}`;
export const deleteMiniPostGroupAPI = `/api/v1/groups/removePost`;
export const handleEditPostGroupAPI = `/api/v1/groupPosts`;

// search
export const getSearchAPI = `/api/v1/searchs`;

//share
export const shareInternalAPI = (id, type) => `/api/v1/getstream/share/${id}?type=${type}`;
export const shareTargetReadingAPI = id => `/api/v1/getstream/shareTargetRead/${id}`;

// share BXH
export const shareApiRanks = id => `/api/v1/getstream/shareTop/${id}`;

// share sach cua toi lam tac gia
export const shareApiMyBook = id => `/api/v1/getstream/shareMyBook/${id}`;

//authors
export const randomAuthorAPI = '/api/v1/users/randomAuthor';

// detail post
export const detailFeedPost = id => `/api/v1/getstream/feedDetail/${id}`;
export const detailFeedPostGroup = id => `/api/v1/groups/detailFeed/${id}`;
export const newNotification = '/api/v1/getstream/notification';

// series
export const getMySeriesAPI = `api/v1/series/mySeries`;
export const getListBookBySeriesAPI = id => `/api/v1/series/listBook/${id}`;
export const getSeriesDetailAPI = id => `/api/v1/series/${id}`;
export const postMoreSeriesAPI = `/api/v1/series/`;
export const addBookToSeriesAPI = id => `/api/v1/series/addBook/${id}`;
export const removeBookFromSeriesAPI = id => `/api/v1/series/deleteBook/${id}`;

// publisher
export const getPublishersAPI = `/api/v1/publishers`;

// get list contact by social media
export const getlistContactByGg = code => `/api/v1/auth/getContacts?code=${code}`;
