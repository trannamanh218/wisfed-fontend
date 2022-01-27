import React from 'react';
import PropTypes from 'prop-types';
import bookImage from 'assets/images/default-book.png';
import './book-thumbnail.scss';
import classNames from 'classnames';

const BookThumbnail = ({ source, name = 'book', size = 'md', handleClick, className = '' }) => {
	return (
		<div
			className={classNames(`book-thumbnail book-thumbnail-${size}`, { [`${className}`]: className })}
			onClick={handleClick}
		>
			<img src={source || bookImage} alt={name} onError={e => e.target.setAttribute('src', `${bookImage}`)} />
		</div>
	);
};

BookThumbnail.propTypes = {
	source: PropTypes.string.isRequired,
	name: PropTypes.string,
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
	handleClick: PropTypes.func,
	className: PropTypes.string,
};

export default BookThumbnail;
