import PropTypes from 'prop-types';
import bookImage from 'assets/images/default-book.png';
import ReactRating from 'shared/react-rating';
import './read-book.scss';

const ReadBook = ({ items }) => {
	return (
		<>
			<div className='read-book'>
				<div className='read-book__image'>
					<img
						src={items.book.images[0] || bookImage}
						alt='image-book-cover'
						onError={e => e.target.setAttribute('src', `${bookImage}`)}
					/>
				</div>
				<h5 className='read-book__name' dangerouslySetInnerHTML={{ __html: items.book.name }}></h5>
				<ReactRating initialRating={items.book.avgRating || 4} readonly />
			</div>
		</>
	);
};

ReadBook.propTypes = {
	items: PropTypes.object,
};

export default ReadBook;
