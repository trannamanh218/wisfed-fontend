import './post-book.scss';
import StatusButton from 'components/status-button';
import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import BookThumbnail from 'shared/book-thumbnail';
import ReadMore from 'shared/read-more';

function PostBook({ postInformations }) {
	const { book } = postInformations;

	return (
		<div className='post__book-container'>
			<div className='post__book__image'>
				<BookThumbnail data-testid='post__book__image' source={book.images[0]} />
			</div>
			<div className='post__book__informations'>
				<div className='post__book__name-and-author'>
					<div data-testid='post__book__name' className='post__book__name'>
						{book.name}
					</div>
					<div className='post__book__author'>{book.author || 'Tác giả: Chưa xác định'}</div>
				</div>
				<div className='post__book__button-and-rating'>
					<StatusButton />
					<ReactRating initialRating={3.3} readonly={true} fractions={2} />
					<div className='post__book__rating__number'>(09 đánh giá)</div>
				</div>
				<ReadMore text={book.description} length={120} />
			</div>
		</div>
	);
}
PostBook.propTypes = {
	postInformations: PropTypes.object.isRequired,
};

export default PostBook;
