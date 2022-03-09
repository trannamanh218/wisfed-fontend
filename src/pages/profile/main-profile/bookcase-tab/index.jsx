import './bookcase.scss';
import sampleBookImg from 'assets/images/sample-book-img.jpg';
import ProgressBar from 'react-bootstrap/ProgressBar';
import classNames from 'classnames';
import BookThumbnail from 'shared/book-thumbnail';
import { BoldCenterCircle, RightArrow } from 'components/svg';

function Bookcase() {
	const DATA = [
		{
			id: 1,
			partName: 'Sách đang đọc',
			bookCover: sampleBookImg,
			bookName: 'Anastasia Steele goes to house Đàn ông sao hoả đàn bà sao kim (2021)',
			author: 'J. Conner  & S. Grand',
			bookPercent: 30,
			reviews: [
				'Ngày 01.01.2021 đọc được 12/300 trang sách',
				'Ngày 01.01.2021 đọc được 12/300 trang sách',
				'Ngày 01.01.2021 đọc được 12/300 trang sách',
			],
		},
		{
			id: 2,
			partName: 'Sách đã đọc',
			bookCover: sampleBookImg,
			bookName: 'One To Watch Nhìn một lần (Phiên bản mới)',
			author: 'J. Conner  & S. Grand',
			bookPercent: 100,
			reviews: ['Ngày 01.01.2021 đọc được 12/300 trang sách', 'Ngày 01.01.2021 đọc được 12/300 trang sách'],
		},
		{
			id: 2,
			partName: '',
			bookCover: sampleBookImg,
			bookName: 'One To Watch Nhìn một lần (Phiên bản mới)',
			author: 'J. Conner  & S. Grand',
			bookPercent: 100,
			reviews: ['Ngày 01.01.2021 đọc được 12/300 trang sách'],
		},
	];
	return (
		<div className='bookcase'>
			{DATA.map(item => (
				<div key={item.id} className='bookcase__item'>
					<div className='bookcase__item-name'>{item.partName}</div>
					<div className='bookcase__item__book'>
						<BookThumbnail source={item.bookCover} size='lg' />
						<div className='bookcase__item__book-info'>
							<div className='bookcase__item__book-info__detail'>
								<div className='bookcase__item__book-name'>{item.bookName}</div>
								<div className='bookcase__item__author-name'>{item.author}</div>
								<div className='bookcase__item__book-progress'>
									<ProgressBar
										className={classNames('bookcase__item__book-progress-bar', {
											'fullBar': item.bookPercent === 100,
										})}
										now={item.bookPercent}
									/>
									<div
										className={classNames('bookcase__item__book-percent', {
											'fullBar': item.bookPercent === 100,
										})}
									>
										{item.bookPercent}%
									</div>
								</div>
							</div>
							<div className='bookcase__item__button'>
								<button>Viết Review</button>
							</div>
						</div>
					</div>
					<div className='bookcase__item__reviews'>
						<div className='bookcase__item__reviews-name'>{`Bài Review ${item.bookName}`}</div>
						<div className='bookcase__item__reviews-list'>
							{item.reviews.map((review, index) => (
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
										<span>{review}</span>
										<a>Review sách</a>
									</div>
								</div>
							))}
						</div>
						<div className='bookcase__review-all'>
							<button>
								<span>Xem toàn bộ Review</span>
								<RightArrow />
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default Bookcase;
