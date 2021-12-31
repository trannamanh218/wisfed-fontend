import React from 'react';
import PropsTypes from 'prop-types';

const StatusItem = ({ item }) => {
	return (
		<li className='status-item'>
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
	item: PropsTypes.object.isRequired,
};

export default StatusItem;
