import React from 'react';
import StatusItem from './StatusItem';
import PropTypes from 'prop-types';
import './style.scss';

const BookShelvesList = ({ list, onChangeShelves }) => {
	const renderList = listData => {
		return (
			<ul className='status-book__list status-book__list--shelves'>
				{listData.map(item => (
					<StatusItem key={item.id} item={item} onChangeShelves={onChangeShelves} />
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
	onChangeShelves: () => {},
};

BookShelvesList.propTypes = {
	list: PropTypes.array.isRequired,
	onChangeShelves: PropTypes.func,
};

export default BookShelvesList;
