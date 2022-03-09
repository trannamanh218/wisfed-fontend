import React from 'react';
import PropTypes from 'prop-types';
import BookItem from 'shared/book-item';
import './shelf.scss';

const Shelf = ({ list, isMyShelve }) => {
	if (list && list.length) {
		return (
			<div className='shelf'>
				{list.map(item => (
					<BookItem key={item.id} {...item} data={item.book} isMyShelve={isMyShelve} />
				))}
			</div>
		);
	}

	return <p>Không có dữ liệu</p>;
};

Shelf.defaultProps = {
	list: [],
	isMyShelve: false,
};

Shelf.propTypes = {
	list: PropTypes.array,
	isMyShelve: PropTypes.bool,
};

export default Shelf;
