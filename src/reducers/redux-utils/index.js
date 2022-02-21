import auth from './auth';
import group from './group';
import post from './post';
import book from './book';
import category from './category';
import user from './user';
import activity from './activity';

const rootReducer = {
	auth,
	post,
	group,
	book,
	category,
	user,
	activity,
};

export default rootReducer;
