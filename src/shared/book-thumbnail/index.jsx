import React from 'react';
import PropsTypes from 'prop-types';
import bookImage from 'assets/images/default-book.png';
import './book-thumbnail.scss';

const BookThumbnail = ({ source, name = 'book', size = 'md', handleClick }) => {
	return (
		<div className={`book-thumbnail book-thumbnail-${size}`} onClick={handleClick}>
			<img src={source || bookImage} alt={name} onError={e => e.target.setAttribute('src', `${bookImage}`)} />
		</div>
	);
};

BookThumbnail.propTypes = {
	source: PropsTypes.string.isRequired,
	name: PropsTypes.string,
	size: PropsTypes.oneOf(['sm', 'md', 'lg']),
	handleClick: PropsTypes.func,
};

export default BookThumbnail;
