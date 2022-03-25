import React from 'react';
import PropTypes from 'prop-types';
import bookImage from 'assets/images/default-book.png';
import ReactRating from 'shared/react-rating';
import './read-book.scss';

const ReadBook = ({ source }) => {
	return (
		<div className='read-book'>
			<div className='read-book__image'>
				<img src={source || bookImage} alt={name} onError={e => e.target.setAttribute('src', `${bookImage}`)} />
			</div>
			<h5 className='read-book__name'>The Mystery of Briony Lodge - Bí mật của Briony Lodge bản dịch 2021</h5>
			<ReactRating initialRating={4} readonly={true} />
		</div>
	);
};

ReadBook.propTypes = {
	images: PropTypes.array,
	source: PropTypes.string,
};

export default ReadBook;
