import './post-book.scss';
import StatusButton from 'components/status-button';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import LinearProgressBar from 'shared/linear-progress-bar';
import { Link } from 'react-router-dom';

function PostBook({ data }) {
	return (
		<div className='post-book'>
			<Link to={`/book/detail/${data.id}`}>
				{data.images.length > 0 && <BookThumbnail source={data?.images[0]} />}
			</Link>
			<div className='post-book__informations'>
				<div className='post-book__name-and-author'>
					<Link to={`/book/detail/${data.id}`}>
						<div className='post-book__name' title={data.name}>
							{data.name}
						</div>
					</Link>
					<div className='post-book__author'>{data.author || 'Tác giả: Chưa xác định'}</div>
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
					<StatusButton
						bookData={data}
						inPostBook={true}
						hasBookStatus={true}
						postActor={data.actorCreatedPost}
					/>
					<div className='post-book__rating__group'>
						<ReactRating initialRating={data.avgRating?.toFixed(1)} readonly={true} fractions={2} />
						<div className='post-book__rating__number'>
							{data.avgRating !== 0 ? (
								<div style={{ textAlign: 'center' }}>
									( {data.avgRating || 0} sao ) ( {data.countRating} đánh giá )
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
};

export default PostBook;
