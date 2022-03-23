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
import Direct from 'pages/choose-topic/abc';
import PropTypes from 'prop-types';
import 'scss/main.scss';

function App({ children }) {
	const dispatch = useDispatch();

	useEffect(() => {
		const params = {
			username: 'admin@gmail.com',
			password: '123456',
			// email: 'nguyenhien@gmail.com',
			// password: '123456',
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
				autoClose={5000}
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
				<Route path='/group' element={<Group />} />
				<Route path='/book/detail/:id' element={<BookDetail />} />
				<Route path='/book/detail/:id/:slug' element={<BookDetail />} />
				<Route path='/review' element={<Review />} />
				<Route path='/quote' element={<Quote />} />
				<Route path='/quote/me' element={<MyQuote />} />
				<Route path='/quote/detail/:id' element={<QuoteDetail />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/confirm-my-book' element={<ConfirmMyBook />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/forget-password' element={<ForgetPassWord />} />
				<Route path='/choose-topic' element={<ChooseTopic />} />
				<Route path='/direct' element={<Direct />} />
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
