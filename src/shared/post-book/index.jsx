import './post-book.scss';
import StatusButton from 'components/status-button';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import LinearProgressBar from 'shared/linear-progress-bar';
import { Link } from 'react-router-dom';

function PostBook({ data, inCreatePost }) {
	const generateAuthorName = authorsInfo => {
		if (authorsInfo && authorsInfo.length) {
			const authorNameArr = authorsInfo.map(item => item.authorName);
			return authorNameArr.join(' - ');
		} else {
			return 'Tác giả: Chưa xác định';
		}
	};

	return (
		<div className='post-book'>
			{data.images.length > 0 && (
				<Link to={`/book/detail/${data.id}`}>
					<BookThumbnail source={data?.images[0]} />
				</Link>
			)}

			<div className='post-book__informations'>
				<div className='post-book__name-and-author'>
					<Link to={`/book/detail/${data.id}`}>
						<div className='post-book__name' title={data.name}>
							{data.name}
						</div>
					</Link>
					<div className='post-book__author'>{generateAuthorName(data.authors)}</div>
					<div className='post-book__edit'>
						<LinearProgressBar percent={((data.progress / data.page) * 100).toFixed()} />
						<div className='post-book__editor'>
							<span className='post-book__ratio'>
								{data.status === 'wantToRead' ? data.progress : data.progress}/{data.page}
							</span>
							<span>Trang sách đã đọc</span>
						</div>
					</div>
				</div>
				<div className='post-book__button-and-rating'>
					<StatusButton bookData={data} inCreatePost={inCreatePost} bookStatus={data.status} />
					<div className='post-book__rating__group'>
						<ReactRating initialRating={data.avgRating?.toFixed(1)} readonly={true} fractions={2} />
						<div className='post-book__rating__number'>
							{data.avgRating !== 0 ? (
								<div style={{ textAlign: 'center' }}>
									( {data.avgRating?.toFixed(1) || 0} sao ) ( {data.countRating} đánh giá )
								</div>
							) : (
								<div>(Chưa có đánh giá)</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

PostBook.propTypes = {
	data: PropTypes.object.isRequired,
	inCreatePost: PropTypes.bool,
};

export default PostBook;
