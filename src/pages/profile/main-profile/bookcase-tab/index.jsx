import './bookcase.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import classNames from 'classnames';
import BookThumbnail from 'shared/book-thumbnail';
import { BoldCenterCircle, RightArrow } from 'components/svg';
import { useEffect, useState, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { STATUS_SUCCESS, STATUS_IDLE, STATUS_LOADING } from 'constants/index';
import { getBookDetail } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Circle from 'shared/loading/circle';
import { updateTitleReviewPage, updateDirectFromProfile } from 'reducers/redux-utils/common';
import PropTypes from 'prop-types';
import { updateCurrentBook } from 'reducers/redux-utils/book';
import { getAllLibraryList } from 'reducers/redux-utils/library';
function Bookcase({ currentUserInfo, currentTab }) {
	const [readingBooks, setReadingBooks] = useState([]);
	const [readBooks, setReadBooks] = useState([]);
	const [status, setStatus] = useState(STATUS_IDLE);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userId } = useParams();

	const myAllLibraryDefault = useSelector(state => state.library.myAllLibrary).default;

	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {
		// Sửa lại phần tủ sách trang cá nhân
		if (!_.isEmpty(userInfo) && userId === userInfo.id && !_.isEmpty(myAllLibraryDefault)) {
			const filterReadbooks = myAllLibraryDefault.filter(item => item.defaultType === 'read');
			const filterReadingbooks = myAllLibraryDefault.filter(item => item.defaultType === 'reading');
			if (filterReadbooks.length) {
				setReadBooks([...filterReadbooks[0].books].reverse());
			} else {
				setReadBooks([]);
			}
			if (filterReadingbooks.length) {
				setReadingBooks([...filterReadingbooks[0].books].reverse().slice(0, 3));
			} else {
				setReadingBooks([]);
			}
		} else {
			getBooksInCurrentLibrary();
		}
	}, [userInfo, userId, myAllLibraryDefault]);

	const getBooksInCurrentLibrary = async () => {
		try {
			const data = await dispatch(getAllLibraryList({ userId: userId })).unwrap();
			const readingBooksResponse = data.default.filter(x => x.defaultType === 'reading');
			if (readingBooksResponse.length === 0) {
				setReadingBooks([]);
			} else {
				setReadingBooks(readingBooksResponse[0].books.reverse().slice(0, 3));
			}
			const haveReadResponse = data.default.filter(x => x.defaultType === 'read');
			if (haveReadResponse.length === 0) {
				setReadBooks([]);
			} else {
				setReadBooks(haveReadResponse[0].books);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const progressBarPercenNumber = item => {
		const progress = ((item.book.bookProgress[0]?.progress / item.book.page) * 100).toFixed();
		return (
			<div className='bookcase__item__book-progress'>
				<ProgressBar
					className={classNames('bookcase__item__book-progress-bar', {
						'fullBar': progress == 100,
					})}
					now={progress}
				/>
				<div
					className={classNames('bookcase__item__book-percent', {
						'fullBar': progress == 100,
					})}
				>
					{progress}%
				</div>
			</div>
		);
	};

	const formatDate = dateData => {
		const newDateData = dateData.slice(0, 10).split('-').reverse().join('.');
		return newDateData;
	};

	const navigateToBookReview = async book => {
		setStatus(STATUS_LOADING);
		try {
			const bookData = await dispatch(getBookDetail(book.id)).unwrap();
			if (!_.isEmpty(bookData)) {
				dispatch(updateTitleReviewPage(`Bài Review về ${book.name} của ${currentUserInfo.fullName}`));
				dispatch(updateDirectFromProfile(true));
				setStatus(STATUS_SUCCESS);
				navigate(`/review/${book.id}/${currentUserInfo.id}`);
			}
		} catch (err) {
			NotificationError(err);
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		}
	};

	const createReview = (book, status) => {
		const newBook = { ...book, status: status };
		dispatch(updateCurrentBook(newBook));
		navigate('/');
	};

	const generateAuthorName = author => {
		if (author && author.length) {
			const authorName = author.map(item => item.authorName);
			return authorName.join(' - ');
		} else {
			return 'Tác giả chưa xác định';
		}
	};

	return (
		<div className='bookcase'>
			{currentTab === 'bookcase' && (
				<>
					{!!readBooks.length || !!readingBooks.length ? (
						<>
							<Circle loading={status === STATUS_LOADING} />
							{readingBooks.length > 0 && (
								<>
									<div className='bookcase__item-name'>Sách đang đọc</div>
									{readingBooks.map((item, index) => (
										<div key={index} className='bookcase__item'>
											<div className='bookcase__item__book'>
												<BookThumbnail source={item.book?.images[0]} size='lg' />
												<div className='bookcase__item__book-info'>
													<div className='bookcase__item__book-info__detail'>
														<div className='bookcase__item__book-name'>
															{item.book?.name}
														</div>
														<div className='bookcase__item__author-name'>
															{generateAuthorName(item?.book?.authors)}
														</div>
														{progressBarPercenNumber(item)}
													</div>
													<div className='bookcase__item__button'>
														<button onClick={() => createReview(item.book, 'reading')}>
															Viết Review
														</button>
													</div>
												</div>
											</div>
											{item.reviewBook.length > 0 && (
												<div className='bookcase__item__reviews'>
													<div className='bookcase__item__reviews-name'>{`Bài Review ${item.book?.name}`}</div>
													<div className='bookcase__item__reviews-list'>
														{item.reviewBook.slice(0, 3).map((reviewItem, index) => (
															<div key={index} className='bookcase__review-item'>
																<div className='bookcase__review-item__svg'>
																	<BoldCenterCircle />
																	{index > 0 && (
																		<div className='bookcase__review-item__vertical-stick'>
																			<div className='bookcase__vertical-stick'></div>
																		</div>
																	)}
																</div>
																<div className='bookcase__review-item__text'>
																	Ngày {formatDate(reviewItem.createdAt)} đọc được{' '}
																	{reviewItem.curProgress}/{item.book.page} trang sách
																</div>
															</div>
														))}
													</div>
													<div className='bookcase__review-all'>
														<button onClick={() => navigateToBookReview(item.book)}>
															<span>Xem toàn bộ Review</span>
															<RightArrow />
														</button>
													</div>
												</div>
											)}
										</div>
									))}
								</>
							)}

							{readBooks.length > 0 && (
								<>
									<div className='bookcase__item-name'>Sách đã đọc</div>
									{readBooks.map((item, index) => (
										<div key={index} className='bookcase__item'>
											<div className='bookcase__item__book'>
												<BookThumbnail source={item.book?.images[0]} size='lg' />
												<div className='bookcase__item__book-info'>
													<div className='bookcase__item__book-info__detail'>
														<div className='bookcase__item__book-name'>
															{item.book?.name}
														</div>
														<div className='bookcase__item__author-name'>
															{generateAuthorName(item?.book?.authors)}
														</div>
														{progressBarPercenNumber(item)}
													</div>
													<div className='bookcase__item__button'>
														<button onClick={() => createReview(item.book, 'read')}>
															Viết Review
														</button>
													</div>
												</div>
											</div>
											{item.reviewBook.length > 0 && (
												<div className='bookcase__item__reviews'>
													<div className='bookcase__item__reviews-name'>{`Bài Review ${item.book?.name}`}</div>
													<div className='bookcase__item__reviews-list'>
														{item.reviewBook.slice(0, 3).map((reviewItem, index) => (
															<div key={index} className='bookcase__review-item'>
																<div className='bookcase__review-item__svg'>
																	<BoldCenterCircle />
																	{index > 0 && (
																		<div className='bookcase__review-item__vertical-stick'>
																			<div className='bookcase__vertical-stick'></div>
																		</div>
																	)}
																</div>
																<div className='bookcase__review-item__text'>
																	Ngày {formatDate(reviewItem.createdAt)} đọc được{' '}
																	{reviewItem.curProgress}/{item.book.page} trang sách
																</div>
															</div>
														))}
													</div>
													<div className='bookcase__review-all'>
														<button onClick={() => navigateToBookReview(item.book)}>
															<span>Xem toàn bộ Review</span>
															<RightArrow />
														</button>
													</div>
												</div>
											)}
										</div>
									))}
								</>
							)}
						</>
					) : (
						<p className='none-data'>Chưa có cuốn sách nào</p>
					)}
				</>
			)}
		</div>
	);
}

Bookcase.propTypes = {
	currentUserInfo: PropTypes.object,
	currentTab: PropTypes.string,
};

export default memo(Bookcase);
