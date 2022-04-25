import './bookcase.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import classNames from 'classnames';
import BookThumbnail from 'shared/book-thumbnail';
import { BoldCenterCircle, RightArrow } from 'components/svg';
import { useFetchAuthLibraries } from 'api/library.hook';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Bookcase() {
	const [readingBooks, setReadingBooks] = useState([]);
	const [readBooks, setReadBooks] = useState([]);
	const { statusLibraries } = useFetchAuthLibraries();

	useEffect(() => {
		const filterReadbooks = statusLibraries.filter(item => item.defaultType === 'read');
		const filterReadingbooks = statusLibraries.filter(item => item.defaultType === 'reading');
		setReadBooks(filterReadbooks[0]?.books);
		setReadingBooks(filterReadingbooks[0]?.books);
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

	return (
		<div className='bookcase'>
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
									<Link to={`/book/detail/${item.bookId}`}>
										<span>Xem toàn bộ Review</span>
										<RightArrow />
									</Link>
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
									<Link to={`/book/detail/${item.bookId}`}>
										<span>Xem toàn bộ Review</span>
										<RightArrow />
									</Link>
								</div>
							</div>
						)}
					</div>
				))}
		</div>
	);
}

export default Bookcase;
