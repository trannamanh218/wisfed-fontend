import React from 'react';
import PropTypes from 'prop-types';

const StatusItem = ({ item }) => {
	return (
		<li className='status-item' data-testid='status-item-book-shelve'>
			<label className='status-item__title'>{item.title}</label>
			<span className='custom-checkbox'>
				<label className='custom-checkbox__container'>
					<input className='status-item__input' type='checkbox' value={item.id} />
					<span className='status-item__checkmark'></span>
				</label>
			</span>
		</li>
	);
};

StatusItem.propTypes = {
	item: PropTypes.object.isRequired,
};

export default StatusItem;
