import WrapIcon from 'components/wrap-icon';
import React from 'react';
import PropsTypes from 'prop-types';
import './style.scss';

const StatusIconItem = ({ item }) => {
	return (
		<li className='status-item status-item--icon'>
			<WrapIcon component={item.icon} />
			<span className='status-item__title'>{item.title}</span>
			<span className='custom-radio'>
				<label className='custom-radio__container'>
					<input type='radio' name='radio' />
					<span className='checkmark'></span>
				</label>
			</span>
		</li>
	);
};

StatusIconItem.propTypes = {
	item: PropsTypes.object.isRequired,
};

export default StatusIconItem;
