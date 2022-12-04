import auth from './auth';
import group from './group';
import post from './post';
import book from './book';
import category from './category';
import user from './user';
import activity from './activity';
import quote from './quote';
import library from './library';
import comment from './comment';
import notificationReducer from './notification';
import profile from './profile';
import forgetPasswordSliceReducer from './forget-password';
import friends from './friends';
import chart from './chart';
import common from './common';
import ranks from './ranks';
import search from './search';
import target from './target';
import series from './series';
import hashtagPage from './hashtag-page';
import publishers from './publishers';

const rootReducer = {
	auth,
	post,
	group,
	book,
	category,
	user,
	activity,
	quote,
	library,
	comment,
	notificationReducer,
	profile,
	forgetPasswordSliceReducer,
	friends,
	chart,
	common,
	ranks,
	search,
	target,
	series,
	hashtagPage,
	publishers,
};

export default rootReducer;
