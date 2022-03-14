import React from 'react';
import PropTypes from 'prop-types';
import BookItem from 'shared/book-item';
import './shelf.scss';

const Shelf = ({ list, isMyShelve, handleClick, handleRemoveBook }) => {
	if (list && list.length) {
		return (
			<div className='shelf'>
				{list.map(item => (
					<BookItem
						key={item.id}
						{...item}
						data={{ ...item.book, library: item?.library }}
						isMyShelve={isMyShelve}
						handleClick={handleClick}
						handleRemoveBook={handleRemoveBook}
					/>
				))}
			</div>
		);
	}

	return <p>Không có dữ liệu</p>;
};

Shelf.defaultProps = {
	list: [],
	isMyShelve: false,
	handleClick: () => {},
	handleRemoveBook: () => {},
};

Shelf.propTypes = {
	list: PropTypes.array,
	isMyShelve: PropTypes.bool,
	handleClick: PropTypes.func,
	handleRemoveBook: PropTypes.func,
};

export default Shelf;
