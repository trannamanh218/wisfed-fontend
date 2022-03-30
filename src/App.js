import BookDetail from 'pages/book-detail';
import Category from 'pages/category';
import CategoryDetail from 'pages/category-detail';
import Group from 'pages/group';
import Home from 'pages/home';
import Profile from 'pages/profile';
import Quote from 'pages/quote';
import QuoteDetail from 'pages/quote-detail';
import MyQuote from 'pages/quote/my-quote';
import Review from 'pages/review';
import BookShelves from 'pages/shelves';
import ConfirmMyBook from 'pages/confirm-my-book';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import ReadingSummary from 'pages/reading-summary';
import ReadingTarget from 'pages/reading-target';
import ForgetPassWordAdminComponet from 'pages/foget-password/component-admin/ForgotAdmin';
import AdminCreatNewPassword from 'pages/foget-password/component-admin/CreatNewPasswordAdmin';
import 'scss/main.scss';

function App({ children }) {
	const dispatch = useDispatch();

	useEffect(() => {
		const params = {
			email: 'admin@gmail.com',
			password: '123456',
			// email: 'nguyenhien@gmail.com',
			// password: '123456',
			// email: 'thuyheobeo@gmail.com',
			// password: '12345678',
			// email: 'register@gmail.com',
			// password: '12345678',
		};

		fetchLogin(params);
	}, []);

	const fetchLogin = async params => {
		try {
			await dispatch(login(params)).unwrap();
		} catch (err) {
			const statusCode = err?.statusCode || 500;
			return statusCode;
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
				<Route path='/category' element={<Category />} />
				<Route path='/category/detail/:id' element={<CategoryDetail />} />
				<Route path='/category/detail/:id/:slug' element={<CategoryDetail />} />
				<Route path='/shelves' element={<BookShelves />} />
				<Route path='/shelves/:userId' element={<BookShelves />} />
				<Route path='/group' element={<Group />} />
				<Route path='/book/detail/:id' element={<BookDetail />} />
				<Route path='/book/detail/:id/:slug' element={<BookDetail />} />
				<Route path='/review/:id' element={<Review />} />
				<Route path='/review/:id/:slug' element={<Review />} />
				<Route path='/quotes' element={<Quote />} />
				<Route path='/quotes/me' element={<MyQuote />} />
				<Route path='/quotes/detail/:id' element={<QuoteDetail />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/confirm-my-book' element={<ConfirmMyBook />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/forget-password' element={<ForgetPassWord />} />
				<Route path='/forget-password-admin' element={<ForgetPassWordAdminComponet />} />
				<Route path='/creat-newpassword-admin' element={<AdminCreatNewPassword />} />
				<Route path='/choose-topic' element={<ChooseTopic />} />
				<Route path='/direct' element={<Direct />} />
				<Route path='/404' element={<NotFound />} />
				<Route path='/reading-summary' element={<ReadingSummary />} />
				<Route path='/reading-target' element={<ReadingTarget />} />
				<Route path='/' element={<Home />} />
				{children}
			</Routes>
		</div>
	);
}

App.propTypes = {
	children: PropTypes.any,
};

export default App;
