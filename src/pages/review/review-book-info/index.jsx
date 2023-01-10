import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import ReadMore from 'shared/read-more';
import './review-book-info.scss';
import PropTypes from 'prop-types';

const ReviewBookInfo = ({ bookInfo }) => {
	return (
		<div className='review-book-info'>
			<BookThumbnail
				className='review-book-info__image'
				size='lg'
				source={bookInfo.frontBookCover || bookInfo.images[0]}
			/>
			<div className='review-book-info__content'>
				<div className='review-book-info__name-author'>
					<h1 className='review-book-info__name'>{bookInfo.name}</h1>
					{!!bookInfo.authors.length && (
						<div className='review-book-info__author'>
							{Array.isArray(bookInfo.authors) && bookInfo.authors.length > 0 ? (
								<>
									Bởi{' '}
									{bookInfo.authors.map((author, index) => (
										<span key={index}>
											<span className='verified'>{author.authorName}</span>
											{index + 1 < bookInfo.authors.length && ', '}
										</span>
									))}
								</>
							) : (
								'Chưa cập nhật tác giả'
							)}
						</div>
					)}
				</div>

				<div className='review-book-info__stars'>
					{bookInfo.avgRating ? (
						<>
							<ReactRating readonly={true} initialRating={bookInfo.avgRating.toFixed(1)} />
							<span>(Trung bình {bookInfo.avgRating.toFixed(1)} sao)</span>
						</>
					) : (
						<div>Chưa có đánh giá</div>
					)}
				</div>

				<div className='review-book-info__description'>
					<ReadMore text={bookInfo.description} height={200} />
				</div>
			</div>
		</div>
	);
};

ReviewBookInfo.propTypes = {
	bookInfo: PropTypes.object,
};

export default ReviewBookInfo;
