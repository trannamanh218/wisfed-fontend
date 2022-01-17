import WrapIcon from 'components/wrap-icon';
import React from 'react';
import PropsTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

const StatusIconItem = ({ item, currentStatus, handleChangeStatus }) => {
	const isActive = currentStatus.value === item.value ? true : false;

	const handleClick = item => {
		if (item.value !== currentStatus.value) {
			handleChangeStatus(item);
		}
	};

	return (
		<li
			className={classNames('status-item', 'status-item--icon', { 'active': isActive })}
			onClick={() => handleClick(item)}
			data-testid='statusIcon'
		>
			<WrapIcon component={item.icon} />
			<span className='status-item__title'>{item.title}</span>
			<span className={classNames('custom-radio', { 'active': isActive })}></span>
		</li>
	);
};

StatusIconItem.propTypes = {
	item: PropsTypes.object.isRequired,
	currentStatus: PropsTypes.object.isRequired,
	handleChangeStatus: PropsTypes.func,
};

export default StatusIconItem;
