import React from 'react';
import PropTypes from 'prop-types';
import BookItem from 'shared/book-item';
import './shelf.scss';

const Shelf = ({ list, isMyShelve, handleClick, handleUpdateLibrary }) => {
	if (list && list.length) {
		return (
			<div className='shelf'>
				{list.map(item => (
					<BookItem
						key={item.id}
						{...item}
						data={item}
						isMyShelve={isMyShelve}
						handleClick={handleClick}
						handleUpdateLibrary={handleUpdateLibrary}
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
	handleUpdateLibrary: () => {},
};

Shelf.propTypes = {
	list: PropTypes.array,
	isMyShelve: PropTypes.bool,
	handleClick: PropTypes.func,
	handleUpdateLibrary: PropTypes.func,
};

export default Shelf;
