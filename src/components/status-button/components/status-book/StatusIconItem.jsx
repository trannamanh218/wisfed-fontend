import WrapIcon from 'components/wrap-icon';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

const StatusIconItem = ({ item, currentStatus, handleChangeStatus }) => {
	const isActive = currentStatus === item.value ? true : false;

	const handleClick = item => {
		if (item.value !== currentStatus) {
			handleChangeStatus(item.value);
		}
	};

	return (
		<li
			className={classNames('status-item', 'status-item--icon', { 'active': isActive })}
			onClick={() => handleClick(item)}
			data-testid='statusIcon'
		>
			<WrapIcon component={item.icon} />
			<span className='status-item__title'>{item.name}</span>
			<span className={classNames('custom-radio', { 'active': isActive })}></span>
		</li>
	);
};

StatusIconItem.propTypes = {
	item: PropTypes.string.isRequired,
	currentStatus: PropTypes.string.isRequired,
	handleChangeStatus: PropTypes.func,
};

export default StatusIconItem;
