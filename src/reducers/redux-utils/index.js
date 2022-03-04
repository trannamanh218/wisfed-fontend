import auth from './auth';
import group from './group';
import post from './post';
import book from './book';
import category from './category';
import user from './user';
import activity from './activity';
import library from './library';
import comment from './comment';

const rootReducer = {
	auth,
	post,
	group,
	book,
	category,
	user,
	activity,
	library,
	comment,
};

export default rootReducer;
