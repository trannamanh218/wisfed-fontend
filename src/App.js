import BookDetail from 'pages/book-detail';
import Category from 'pages/category';
import CategoryDetail from 'pages/category-detail';
import Friends from 'pages/friends';
import Home from 'pages/home';
import Profile from 'pages/profile';
import QuoteDetail from 'pages/quote-detail';
import Quote from 'pages/quote';
import Review from 'pages/review';
import BookShelves from 'pages/shelves';
import ConfirmMyBook from 'pages/confirm-my-book';
import Notification from 'pages/notification/compornent-main';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { login } from 'reducers/redux-utils/auth';
import { ToastContainer } from 'react-toastify';
import Login from 'pages/login/element';
import Register from 'pages/register/component';
import ForgetPassWord from 'pages/foget-password/component';
import ChooseTopic from 'pages/choose-topic';
import Direct from 'pages/choose-topic/DirectPage';
import PropTypes from 'prop-types';
import NotFound from 'pages/not-found';
import { NotificationError } from 'helpers/Error';
import ReadingSummary from 'pages/reading-summary';
import ReadingTarget from 'pages/reading-target';
import ForgetPassWordAdminComponet from 'pages/foget-password/component-admin/ForgotAdmin';
import AdminCreatNewPassword from 'pages/foget-password/component-admin/CreatNewPasswordAdmin';
import DetailFriend from 'pages/friends/component/detail-friend';
import 'scss/main.scss';
import QuoteAll from 'pages/quote/all-quote/';
import Group from 'pages/group-page';
import Ranks from 'pages/ranks';
import { getAllLibraryList, getAllMyLibraryRedux } from 'reducers/redux-utils/library';

function App({ children }) {
	const [myUserId, setMyUserId] = useState('');

	const dispatch = useDispatch();
	const updateMyLibrary = useSelector(state => state.library.updateMyLibrary);

	useEffect(() => {
		fetchLogin();
	}, []);

	useEffect(() => {
		if (myUserId) {
			getAllMyLibrary(myUserId);
		}
	}, [myUserId, updateMyLibrary]);

	const fetchLogin = async () => {
		try {
			const params = {
				email: 'register@gmail.com',
				password: '12345678',
				// email: 'hungngonzai@gmail.com',
				// password: '123456',
				// email: 'admin@gmail.com',
				// password: '123456',
			};
			const res = await dispatch(login(params)).unwrap();
			setMyUserId(res.id);
		} catch (err) {
			NotificationError(err);
			const statusCode = err?.statusCode || 500;
			return statusCode;
		}
	};

	const getAllMyLibrary = async userId => {
		try {
			const data = await dispatch(getAllLibraryList({ userId })).unwrap();
			dispatch(getAllMyLibraryRedux(data));
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div>
			<ToastContainer
				position='top-center'
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<Routes>
				<Route path='/top100' element={<Ranks />} />
				<Route path='/notification' element={<Notification />} />
				<Route path='/category' element={<Category />} />
				<Route path='/category/detail/:id' element={<CategoryDetail />} />
				<Route path='/category/detail/:id/:slug' element={<CategoryDetail />} />
				<Route path='/shelves/:userId' element={<BookShelves />} />
				<Route path='/friends' element={<Friends />} />
				<Route path='/friends/:slug' element={<DetailFriend />} />
				<Route path='/book/detail/:bookId' element={<BookDetail />} />
				<Route path='/book/detail/:bookId/:slug' element={<BookDetail />} />
				<Route path='/review/:bookId/:userId' element={<Review />} />
				<Route path='/quotes/:userId' element={<Quote />} />
				<Route path='/quotes/all' element={<QuoteAll />} />
				<Route path='/quotes/detail/:id' element={<QuoteDetail />} />
				<Route path='/profile/:userId' element={<Profile />} />
				<Route path='/confirm-my-book/:bookId' element={<ConfirmMyBook />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/forget-password' element={<ForgetPassWord />} />
				<Route path='/forget-password-admin' element={<ForgetPassWordAdminComponet />} />
				<Route path='/creat-newpassword-admin' element={<AdminCreatNewPassword />} />
				<Route path='/choose-topic' element={<ChooseTopic />} />
				<Route path='/direct' element={<Direct />} />
				<Route path='/reading-summary/:userId' element={<ReadingSummary />} />
				<Route path='/reading-target/:userId' element={<ReadingTarget />} />
				<Route path='/group' element={<Group />} />
				<Route path='/' element={<Home />} />
				<Route path='*' element={<NotFound />} />
				{children}
			</Routes>
		</div>
	);
}

App.propTypes = {
	children: PropTypes.any,
};

export default App;
