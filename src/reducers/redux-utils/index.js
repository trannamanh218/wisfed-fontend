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
import forgetPasswordSliceReducer from './forget-password';

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
	forgetPasswordSliceReducer,
};

export default rootReducer;
