import PropTypes from 'prop-types';
import bookImage from 'assets/images/default-book.png';
import ReactRating from 'shared/react-rating';
import './read-book.scss';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';

const ReadBook = ({ items }) => {
	const navigate = useNavigate();

	const goToBookDetail = () => {
		navigate(RouteLink.bookDetail(items.book.id, items.book.name));
	};

	return (
		<>
			<div className='read-book'>
				<div className='read-book__image'>
					<img
						src={items.book.frontBookCover || items.book.images[0] || bookImage}
						alt='image-book-cover'
						onError={e => e.target.setAttribute('src', `${bookImage}`)}
						onClick={goToBookDetail}
					/>
				</div>
				<h5
					className='read-book__name'
					dangerouslySetInnerHTML={{ __html: items.book.name }}
					onClick={goToBookDetail}
				/>
				<ReactRating initialRating={items.book.avgRating || 4} readonly />
			</div>
		</>
	);
};

ReadBook.propTypes = {
	items: PropTypes.object,
};

export default ReadBook;
