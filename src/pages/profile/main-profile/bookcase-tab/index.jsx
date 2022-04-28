import './bookcase.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import classNames from 'classnames';
import BookThumbnail from 'shared/book-thumbnail';
import { BoldCenterCircle, RightArrow } from 'components/svg';
import { useFetchAuthLibraries } from 'api/library.hook';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATUS_SUCCESS, STATUS_IDLE, STATUS_LOADING } from 'constants';
import { getBookDetail } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import Circle from 'shared/loading/circle';
import { updateTitleReviewPage, updateDirectFromProfile } from 'reducers/redux-utils/common';

function Bookcase({ userInfo }) {
	const [readingBooks, setReadingBooks] = useState([]);
	const [readBooks, setReadBooks] = useState([]);
	const { statusLibraries } = useFetchAuthLibraries();
	const [status, setStatus] = useState(STATUS_IDLE);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const filterReadbooks = statusLibraries.filter(item => item.defaultType === 'read');
		const filterReadingbooks = statusLibraries.filter(item => item.defaultType === 'reading');
		setReadBooks(filterReadbooks[0]?.books.reverse());
		setReadingBooks(filterReadingbooks[0]?.books.reverse().slice(0, 3));
	}, [statusLibraries]);

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
			const bookData = await dispatch(getBookDetail({ id: book.id })).unwrap();
			if (!_.isEmpty(bookData)) {
				dispatch(updateTitleReviewPage(`Bài Review về ${book.name} của ${userInfo.fullName}`));
				dispatch(updateDirectFromProfile(true));
				setStatus(STATUS_SUCCESS);
				navigate(`/review/${book.id}/${userInfo.id}`);
			}
		} catch (err) {
			NotificationError(err);
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		}
	};

	return (
		<div className='bookcase'>
			<Circle loading={status === STATUS_LOADING} />
			<div className='bookcase__item-name'>Sách đang đọc</div>
			{readingBooks &&
				readingBooks.length > 0 &&
				readingBooks.map(item => (
					<div key={item.bookId} className='bookcase__item'>
						<div className='bookcase__item__book'>
							<BookThumbnail source={item.book?.images[0]} size='lg' />
							<div className='bookcase__item__book-info'>
								<div className='bookcase__item__book-info__detail'>
									<div className='bookcase__item__book-name'>{item.book?.name}</div>
									<div className='bookcase__item__author-name'>
										{item.book?.author ? item.book?.author : 'Tác giả chưa xác định'}
									</div>
									{progressBarPercenNumber(item)}
								</div>
								<div className='bookcase__item__button'>
									<button>Viết Review</button>
								</div>
							</div>
						</div>
						{item.reviewBook.length > 0 && (
							<div className='bookcase__item__reviews'>
								<div className='bookcase__item__reviews-name'>{`Bài Review ${item.book?.name}`}</div>
								<div className='bookcase__item__reviews-list'>
									{item.reviewBook.slice(0, 3).map((reviewItem, index) => (
										<div key={reviewItem.id} className='bookcase__review-item'>
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
			<div className='bookcase__item-name'>Sách đã đọc</div>
			{readBooks &&
				readBooks.length > 0 &&
				readBooks.map(item => (
					<div key={item.bookId} className='bookcase__item'>
						<div className='bookcase__item__book'>
							<BookThumbnail source={item.book?.images[0]} size='lg' />
							<div className='bookcase__item__book-info'>
								<div className='bookcase__item__book-info__detail'>
									<div className='bookcase__item__book-name'>{item.book?.name}</div>
									<div className='bookcase__item__author-name'>
										{item.book?.author ? item.book?.author : 'Tác giả chưa xác định'}
									</div>
									{progressBarPercenNumber(item)}
								</div>
								<div className='bookcase__item__button'>
									<button>Viết Review</button>
								</div>
							</div>
						</div>
						{item.reviewBook.length > 0 && (
							<div className='bookcase__item__reviews'>
								<div className='bookcase__item__reviews-name'>{`Bài Review ${item.book?.name}`}</div>
								<div className='bookcase__item__reviews-list'>
									{item.reviewBook.slice(0, 3).map((reviewItem, index) => (
										<div key={reviewItem.id} className='bookcase__review-item'>
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
		</div>
	);
}

export default Bookcase;
