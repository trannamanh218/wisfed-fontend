import './bookcase.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import classNames from 'classnames';
import BookThumbnail from 'shared/book-thumbnail';
import { BoldCenterCircle, RightArrow } from 'components/svg';
import { useFetchAuthLibraries } from 'api/library.hook';
import { useEffect, useState } from 'react';

function Bookcase() {
	const { statusLibraries } = useFetchAuthLibraries();
	const [readingBooks, setReadingBooks] = useState([]);
	const [readBooks, setReadBooks] = useState([]);
	useEffect(() => {
		const filterReadbooks = statusLibraries.filter(item => item.defaultType === 'read');
		const filterReadingbooks = statusLibraries.filter(item => item.defaultType === 'reading');
		return setReadBooks(filterReadbooks), setReadingBooks(filterReadingbooks);
	}, [statusLibraries]);

	const progressBarPercenNumber = items => {
		const progress = ((items.book.bookProgress[0]?.progress / items.book.page) * 100).toFixed();
		return (
			<div className='bookcase__item__book-progress'>
				<ProgressBar
					className={classNames('bookcase__item__book-progress-bar', {
						'fullBar': items.book.bookProgress[0]?.progress === 100,
					})}
					now={progress}
				/>
				<div
					className={classNames('bookcase__item__book-percent', {
						'fullBar': items.book.bookProgress[0]?.progress === 100,
					})}
				>
					{progress}%
				</div>
			</div>
		);
	};

	return (
		<div className='bookcase'>
			<div className='bookcase__item-name'>Sách đang đọc</div>
			{readingBooks.map(item =>
				item?.books?.slice(0, 3).map(items => (
					<div key={items.id} className='bookcase__item'>
						<div className='bookcase__item__book'>
							<BookThumbnail source={items.book?.images[0]} size='lg' />
							<div className='bookcase__item__book-info'>
								<div className='bookcase__item__book-info__detail'>
									<div className='bookcase__item__book-name'>{items.book?.name}</div>
									<div className='bookcase__item__author-name'>
										{item.book?.author ? item.book?.author : 'Tác giả chưa xác định'}
									</div>
									{progressBarPercenNumber(items)}
								</div>
								<div className='bookcase__item__button'>
									<button>Viết Review</button>
								</div>
							</div>
						</div>
						<div className='bookcase__item__reviews'>
							<div className='bookcase__item__reviews-name'>{`Bài Review ${items.book?.name}`}</div>
							<div className='bookcase__item__reviews-list'>
								<div className='bookcase__review-item'>
									<div className='bookcase__review-item__svg'>
										<BoldCenterCircle />

										<div className='bookcase__review-item__vertical-stick'>
											<div className='bookcase__vertical-stick'></div>
										</div>
									</div>
									<div className='bookcase__review-item__text'>
										<span></span>
										<a>Review sách</a>
									</div>
								</div>
							</div>
							<div className='bookcase__review-all'>
								<button>
									<span>Xem toàn bộ Review</span>
									<RightArrow />
								</button>
							</div>
						</div>
					</div>
				))
			)}
			<div className='bookcase__item-name'>Sách đã đọc</div>
			{readBooks.map(item =>
				item?.books?.slice(0, 3).map(items => (
					<div key={items.id} className='bookcase__item'>
						<div className='bookcase__item__book'>
							<BookThumbnail source={items.book?.images[0]} size='lg' />
							<div className='bookcase__item__book-info'>
								<div className='bookcase__item__book-info__detail'>
									<div className='bookcase__item__book-name'>{items.book?.name}</div>
									<div className='bookcase__item__author-name'>
										{item.book?.author ? item.book?.author : 'Tác giả chưa xác định'}
									</div>
									<div className='bookcase__item__book-progress'>
										<ProgressBar
											className={classNames('bookcase__item__book-progress-bar', {
												'fullBar': item.defaultType === 'read',
											})}
											now={100}
										/>
										<div
											className={classNames('bookcase__item__book-percent', {
												'fullBar': item.defaultType === 'read',
											})}
										>
											{100}%
										</div>
									</div>
								</div>
								<div className='bookcase__item__button'>
									<button>Viết Review</button>
								</div>
							</div>
						</div>
						<div className='bookcase__item__reviews'>
							<div className='bookcase__item__reviews-name'>{`Bài Review ${items.book?.name}`}</div>
							<div className='bookcase__item__reviews-list'>
								<div className='bookcase__review-item'>
									<div className='bookcase__review-item__svg'>
										<BoldCenterCircle />

										<div className='bookcase__review-item__vertical-stick'>
											<div className='bookcase__vertical-stick'></div>
										</div>
									</div>
									<div className='bookcase__review-item__text'>
										<span></span>
										<a>Review sách</a>
									</div>
								</div>
							</div>
							<div className='bookcase__review-all'>
								<button>
									<span>Xem toàn bộ Review</span>
									<RightArrow />
								</button>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
}

export default Bookcase;
