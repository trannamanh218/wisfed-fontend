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
import notificationReducer from './notificaiton';

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
};

export default rootReducer;
