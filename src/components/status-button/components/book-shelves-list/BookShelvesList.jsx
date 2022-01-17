import React from 'react';
import StatusItem from './StatusItem';
import PropsTypes from 'prop-types';

const BookShelvesList = ({ list }) => {
	const renderList = listData => {
		return (
			<ul className='status-book__list status-book__list--shelves'>
				{listData.map(item => (
					<StatusItem key={item.id} item={item} />
				))}
			</ul>
		);
	};

	return (
		<div className='status-book-wrapper'>
			<h4 className='status-book__title'>Giá sách của tôi</h4>
			{list.length ? renderList(list) : null}
		</div>
	);
};

BookShelvesList.defaultProps = {
	list: [],
};

BookShelvesList.propTypes = {
	list: PropsTypes.array.isRequired,
};

export default BookShelvesList;
