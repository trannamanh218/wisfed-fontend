import { NotificationError } from 'helpers/Error';
import Storage from 'helpers/Storage';
import _ from 'lodash';
import { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { checkLogin, getCheckJwt } from 'reducers/redux-utils/auth';
import { changeKey } from 'reducers/redux-utils/forget-password';
import { getAllLibraryList, setAllMyLibraryRedux } from 'reducers/redux-utils/library';

import 'scss/main.scss';

// pages and components
import BookDetail from 'pages/book-detail';
import BooksAuthor from 'pages/books-author';
import Category from 'pages/category';
import CategoryDetail from 'pages/category-detail';
import ChooseTopic from 'pages/choose-topic';
import DirectPageDefault from 'pages/direct-page/DirectPageDefault';
import ConfirmMyBook from 'pages/confirm-my-book';
import ForgetPassWordComponent from 'pages/foget-password/component';
import AdminCreateNewPassword from 'pages/foget-password/component-admin/CreateNewPasswordAdmin';
import Friends from 'pages/friends';
import DetailFriend from 'pages/friends/component/detail-friend';
import Group from 'pages/group-page';
import LayoutGroup from 'pages/group-page/group-container';
import MyGroup from 'pages/group-page/group-container/MyGroup';
import HashtagPage from 'pages/hashtag-page';
import Home from 'pages/home';
import DetailFeed from 'pages/home/components/newfeed/components/detailFeed';
import Login from 'pages/login';
import NotFound from 'pages/not-found';
import Notification from 'pages/notification/compornent-main';
import Profile from 'pages/profile';
import Quote from 'pages/quote';
import QuoteDetail from 'pages/quote-detail';
import QuoteAll from 'pages/quote/all-quote/';
import QuotesByCategory from 'pages/quotes-by-category';
import Ranks from 'pages/ranks';
import ReadingSummary from 'pages/reading-summary';
import ReadingSummaryChartAuthor from 'pages/reading-summary-author';
import ReadingTarget from 'pages/reading-target';
import Register from 'pages/register';
import Result from 'pages/result';
import Review from 'pages/review';
import BookShelves from 'pages/shelves';
import UploadBook from 'pages/upload-book/UploadBook';
import PropTypes from 'prop-types';
import ModalCheckLogin from 'shared/modal-check-login';
import QuotesByHashTag from 'pages/quotes-by-hashtag/QuotesByHashTag';
import Header from 'components/header';
import DirectPageInvite from 'pages/direct-page/DirectPageInvite';

function App({ children }) {
	const dispatch = useDispatch();
	const updateMyLibrary = useSelector(state => state.library.updateMyLibrary);
	const { routerLogin, userInfo } = useSelector(state => state.auth);
	const navigate = useNavigate();

	const location = useLocation();

	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
	const html = safeDocument.documentElement;

	useEffect(async () => {
		const accsetToken = Storage.getAccessToken();
		if (accsetToken) {
			dispatch(checkLogin(true));
			await dispatch(getCheckJwt()).unwrap();
		} else {
			dispatch(checkLogin(false));
		}
		if (window.location.pathname.includes('/shelves') && accsetToken === null) {
			navigate('/login');
		}
	}, [location]);

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			getAllMyLibrary(userInfo.id);
		}
	}, [userInfo, updateMyLibrary]);

	const getAllMyLibrary = async userId => {
		try {
			const data = await dispatch(getAllLibraryList({ userId })).unwrap();
			dispatch(setAllMyLibraryRedux(data));
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		allowScroll();
		if (location.pathname !== '/forget-password/') {
			dispatch(changeKey(false));
		}
	}, [location]);

	const renderHeader = () => {
		const excludePaths = [
			'/login',
			'/register',
			'/forget-password',
			'/create-newpassword-admin',
			'/choose-topic',
			'/api/v1/auth/direct',
		];
		if (!excludePaths.some(path => location.pathname.includes(path)))
			return (
				<div style={{ margin: 'auto', maxWidth: '1440px' }}>
					<Header />
				</div>
			);
	};

	const allowScroll = () => {
		html.style.position = '';
		html.style.overflow = '';
		body.style.position = '';
		body.style.overflow = '';
		body.style.paddingRight = '';
	};

	return (
		<div>
			<ToastContainer
				position='top-center'
				autoClose={2500}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<ModalCheckLogin routerLogin={routerLogin} />
			{renderHeader()}
			<Routes>
				{Storage.getAccessToken() !== null && (
					<>
						<Route path='/upload-book' element={<UploadBook />} />
						<Route path='/shelves/:userId' element={<BookShelves />} />
						<Route path='/friends' element={<Friends />} />
						<Route path='/friends/:slug' element={<DetailFriend />} />
						<Route path='/notification' element={<Notification />} />
						<Route path='/confirm-my-book/:bookId' element={<ConfirmMyBook />} />
						<Route path='/quotes/hashtag/me/:hashtag' element={<QuotesByHashTag />} />
					</>
				)}
				<Route path='/top100' element={<Ranks />} />
				<Route path='/detail-feed/:type/:idPost' element={<DetailFeed />} />
				<Route path='/books-author/:userId' element={<BooksAuthor />} />
				<Route path='/book-author-charts/:bookId' element={<ReadingSummaryChartAuthor />} />
				<Route path='/result/q=:value' element={<Result />} />
				<Route path='/category' element={<Category />} />
				<Route path='/profile/:userId' element={<Profile />} />
				<Route path='/category/detail/:id' element={<CategoryDetail />} />
				<Route path='/category/detail/:id/:slug' element={<CategoryDetail />} />
				<Route path='/book/detail/:bookId' element={<BookDetail />} />
				<Route path='/book/detail/:bookId/:slug' element={<BookDetail />} />
				<Route path='/review/:bookId/:userId' element={<Review />} />
				<Route path='/quotes/:userId' element={<Quote />} />
				<Route path='/quotes/all' element={<QuoteAll />} />
				<Route path='/quotes/category/:categoryId' element={<QuotesByCategory />} />
				<Route path='/quotes/hashtag/:hashtag' element={<QuotesByHashTag />} />
				<Route path='/quotes/detail/:id/:userId' element={<QuoteDetail />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/forget-password' element={<ForgetPassWordComponent />} />
				<Route path='/create-newpassword-admin' element={<AdminCreateNewPassword />} />
				<Route path='/choose-topic' element={<ChooseTopic />} />
				<Route path='/direct' element={<DirectPageDefault />} />
				<Route path='/direct/login' element={<DirectPageDefault />} />
				<Route path='/api/v1/auth/direct' element={<DirectPageInvite />} />
				<Route path='/reading-summary/:userId' element={<ReadingSummary />} />
				<Route path='/reading-target/:userId' element={<ReadingTarget />} />
				<Route path='/group' element={<LayoutGroup />} />
				<Route path='/my-group' element={<MyGroup />} />
				<Route path='/hashtag/:hashtag' element={<HashtagPage />} />
				<Route path='/hashtag-group/:groupId/:hashtag' element={<HashtagPage />} />
				<Route path='/group/:id' element={<Group />} />
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
