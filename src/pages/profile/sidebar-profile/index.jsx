import { useEffect, useState } from 'react';
import BookSlider from 'shared/book-slider';
import ReadingBook from 'shared/reading-book';
import './sidebar-profile.scss';
import classNames from 'classnames';
import caretIcon from 'assets/images/caret.png';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useSelector } from 'react-redux';
import RenderProgress from 'shared/render-progress';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DEFAULT_TOGGLE_ROWS } from 'constants/index';
import { useDispatch } from 'react-redux';
import { getAllLibraryList, handleSetDefaultLibrary } from 'reducers/redux-utils/library';
import { NotificationError } from 'helpers/Error';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import Storage from 'helpers/Storage';

const SidebarProfile = ({ currentUserInfo, handleViewBookDetail }) => {
	const { userId } = useParams();
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const [bookReading, setBookReading] = useState({});
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(DEFAULT_TOGGLE_ROWS);
	const [booksSliderTitle, setBooksSliderTitle] = useState('');
	const [libraryShown, setLibraryShown] = useState([]);

	const { userInfo } = useSelector(state => state.auth);
	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	const dispatch = useDispatch();

	const navigate = useNavigate();

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			if (window.location.pathname.includes('profile')) {
				if (userInfo.id === userId) {
					setBooksSliderTitle('Sách tôi là tác giả');
				} else {
					setBooksSliderTitle(`Sách của ${currentUserInfo.fullName}`);
				}
			} else {
				setBooksSliderTitle('Sách tôi là tác giả');
			}
		}
	}, [userInfo, currentUserInfo]);

	const getAllLibraryListUser = async () => {
		try {
			const data = { userId: userId };
			const res = await dispatch(getAllLibraryList(data)).unwrap();
			setLibraryShown(res.custom);

			const reading = res.default.filter(item => item.defaultType === 'reading');
			if (reading.length > 0 && reading[0].books.length) {
				const books = reading[0].books;
				setBookReading(books[0].book);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(async () => {
		if (userInfo.id === userId) {
			if (!_.isEmpty(myAllLibraryRedux)) {
				setLibraryShown(myAllLibraryRedux.custom);
				const readingLibrary = myAllLibraryRedux.default.filter(item => item.defaultType === 'reading');
				if (readingLibrary.length > 0 && readingLibrary[0].books.length) {
					const books = readingLibrary[0].books;
					setBookReading(books[0].book);
				}
			}
		} else {
			getAllLibraryListUser();
		}
	}, [myAllLibraryRedux, userId]);

	const handleViewMore = () => {
		const length = libraryShown.length;
		let maxLength;

		if (length <= 20) {
			maxLength = length;
		} else {
			maxLength = 20;
		}

		const newRows = isExpand ? DEFAULT_TOGGLE_ROWS : maxLength;
		setRows(newRows);
		setIsExpand(!isExpand);
	};

	const handleRenderTargetReading = () => {
		if (userId) {
			return <RenderProgress userIdParams={userId} />;
		} else if (!_.isEmpty(userInfo)) {
			return <RenderProgress userIdParams={userInfo.id} />;
		}
	};

	const handleDirect = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			return navigate(`/shelves/${userId}`);
		}
	};

	const handleDirectToBookShelves = paramItem => {
		dispatch(handleSetDefaultLibrary(paramItem));
		navigate(`/shelves/${userInfo.id}`);
	};

	return (
		<div className='sidebar-profile'>
			<ReadingBook bookData={bookReading} />
			{booksAuthor.length > 0 && (
				<BookSlider
					className='book-reference__slider'
					title={booksSliderTitle}
					list={booksAuthor}
					handleViewBookDetail={handleViewBookDetail}
				/>
			)}

			{handleRenderTargetReading()}

			{libraryShown.length > 0 && (
				<div className='sidebar-profile__personal__category'>
					<h4>Giá sách cá nhân</h4>
					<div className='dualColumn'>
						<ul className={classNames('dualColumn-list', { [`bg-light`]: false })}>
							{libraryShown.slice(0, rows).map((item, index) => (
								<li
									className={classNames('dualColumn-item', {
										'has-background': false,
									})}
									key={index}
								>
									<span
										onClick={() => handleDirectToBookShelves(item)}
										className='dualColumn-item__title link'
									>
										{item.name}
									</span>
									<span
										onClick={() => handleDirectToBookShelves(item)}
										className='dualColumn-item__number link'
									>
										{item.books.length} cuốn
									</span>
								</li>
							))}
						</ul>

						{!isExpand && libraryShown.length > DEFAULT_TOGGLE_ROWS && (
							<button className='dualColumn-btn' onClick={handleViewMore}>
								<img className='view-caret' src={caretIcon} alt='caret-icon' />
								<span>Xem thêm</span>
							</button>
						)}
						{isExpand ||
							(libraryShown.length <= DEFAULT_TOGGLE_ROWS && (
								<button onClick={handleDirect} className='sidebar__view-more-btn--blue'>
									Xem thêm
								</button>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

SidebarProfile.propTypes = {
	currentUserInfo: PropTypes.object,
	handleViewBookDetail: PropTypes.any,
};

export default SidebarProfile;
