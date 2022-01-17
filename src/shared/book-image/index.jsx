import React from 'react';
import PropsTypes from 'prop-types';
import bookImage from 'assets/images/default-book.png';
import './book-image.scss';

const BookImage = ({ source, name = 'book', size = 'md', handleClick }) => {
	return (
		<div className={`book-image book-image-${size}`} onClick={handleClick}>
			<img src={source || bookImage} alt={name} onError={e => e.target.setAttribute('src', `${bookImage}`)} />
		</div>
	);
};

BookImage.propTypes = {
	source: PropsTypes.string.isRequired,
	name: PropsTypes.string,
	size: PropsTypes.oneOf(['sm', 'md', 'lg']),
	handleClick: PropsTypes.func,
};

export default BookImage;
