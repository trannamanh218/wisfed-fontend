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
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { login } from 'reducers/redux-utils/auth';
import 'scss/main.scss';

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		const params = {
			email: 'thuyheobeo@gmail.com',
			password: '12345678',
		};

		fetchLogin(params);
	}, []);

	const fetchLogin = async params => {
		try {
			await dispatch(login(params)).unwrap();
		} catch (err) {
			return;
		}
	};

	return (
		<Routes>
			<Route path='/category' element={<Category />} />
			<Route path='/category/detail' element={<CategoryDetail />} />
			<Route path='/shelves' element={<BookShelves />} />
			<Route path='/group' element={<Group />} />
			<Route path='/book/detail' element={<BookDetail />} />
			<Route path='/review' element={<Review />} />
			<Route path='/quote' element={<Quote />} />
			<Route path='/quote/me' element={<MyQuote />} />
			<Route path='/quote/detail' element={<QuoteDetail />} />
			<Route path='/profile' element={<Profile />} />
			<Route path='/' element={<Home />} />
		</Routes>
	);
}

export default App;
