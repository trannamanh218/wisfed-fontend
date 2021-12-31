import React from 'react';
import StatusItem from './StatusItem';
import PropsTypes from 'prop-types';

const BookShelvesList = ({ list }) => {
	return (
		<div className='status-book-wrapper'>
			<h4 className='status-book__title'>Giá sách của tôi</h4>
			<ul className='status-book__list status-book__list--shelves'>
				{list.map(item => (
					<StatusItem key={item.id} item={item} />
				))}
			</ul>
		</div>
	);
};

BookShelvesList.propTypes = {
	list: PropsTypes.array.isRequired,
};

export default BookShelvesList;
