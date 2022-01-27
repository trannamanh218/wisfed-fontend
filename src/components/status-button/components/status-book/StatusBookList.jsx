import { CircleCheckIcon, CoffeeCupIcon, TargetIcon } from 'components/svg';
import React from 'react';
import StatusIconItem from './StatusIconItem';
import PropTypes from 'prop-types';
import './style.scss';

const StatusBookList = ({ currentStatus, handleChangeStatus }) => {
	const list = [
		{
			'title': 'Đang đọc',
			'value': 'reading',
			'icon': CoffeeCupIcon,
		},
		{
			'title': 'Đã đọc',
			'value': 'readAlready',
			'icon': CircleCheckIcon,
		},
		{
			'title': 'Muốn đọc',
			'value': 'wantRead',
			'icon': TargetIcon,
		},
	];

	return (
		<div className='status-book-wrapper'>
			<h4 className='status-book__title'>Trạng thái cuốn sách</h4>
			<ul className='status-book__list'>
				{list.map(item => (
					<StatusIconItem
						key={item.title}
						item={item}
						currentStatus={currentStatus}
						handleChangeStatus={handleChangeStatus}
					/>
				))}
			</ul>
		</div>
	);
};

StatusBookList.propTypes = {
	currentStatus: PropTypes.object.isRequired,
	handleChangeStatus: PropTypes.func,
};

export default StatusBookList;
