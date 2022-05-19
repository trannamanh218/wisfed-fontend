import { CircleCheckIcon, CoffeeCupIcon, TargetIcon } from 'components/svg';
import StatusIconItem from './StatusIconItem';
import PropTypes from 'prop-types';
import './style.scss';
import { STATUS_BOOK } from 'constants';

const StatusBookList = ({ currentStatus, handleChangeStatus }) => {
	const list = [
		{
			'name': 'Đang đọc',
			'value': STATUS_BOOK.reading,
			'icon': CoffeeCupIcon,
		},
		{
			'name': 'Đã đọc',
			'value': STATUS_BOOK.read,
			'icon': CircleCheckIcon,
		},
		{
			'name': 'Muốn đọc',
			'value': STATUS_BOOK.wantToRead,
			'icon': TargetIcon,
		},
	];

	return (
		<div className='status-book-wrapper'>
			<h4 className='status-book__name'>Trạng thái cuốn sách</h4>
			<ul className='status-book__list'>
				{list.map(item => (
					<StatusIconItem
						key={item.name}
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
	currentStatus: PropTypes.string.isRequired,
	handleChangeStatus: PropTypes.func,
};

export default StatusBookList;
