import React from 'react';
import PropTypes from 'prop-types';
import BookItem from 'shared/book-item';
import './shelf.scss';

const Shelf = ({ list }) => {
	if (list && list.length) {
		return (
			<div className='shelf'>
				{list.map(item => (
					<BookItem key={item.name} {...item} />
				))}
			</div>
		);
	}

	return <p>Không có dữ liệu</p>;
};

Shelf.propTypes = {
	list: PropTypes.array,
};

export default Shelf;
