import { readingStatus } from 'constants';
import React from 'react';
import StatusIconItem from './StatusIconItem';
import './style.scss';

const StatusBookList = () => {
	const statusList = readingStatus;

	return (
		<div className='status-book-wrapper'>
			<h4 className='status-book__title'>Trạng thái cuốn sách</h4>
			<ul className='status-book__list'>
				{statusList.map(item => (
					<StatusIconItem key={item.title} item={item} />
				))}
			</ul>
		</div>
	);
};

export default StatusBookList;
