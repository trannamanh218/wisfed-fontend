import React from 'react';
import PropsTypes from 'prop-types';
import './dual-column.scss';
import classNames from 'classnames';

const DualColumn = props => {
	const { list, background, isBackground } = props;

	if (list && list.length)
		return (
			<ul className={classNames('dualColumn-list', { [`bg-${background}`]: isBackground })}>
				{list.map((item, index) => (
					<li className='dualColumn-item' key={index}>
						<span className='dualColumn-item__title'>{item.name}</span>
						<span className='dualColumn-item__number'>{item.quantity}</span>
					</li>
				))}
			</ul>
		);

	return <p>Không có dữ liệu</p>;
};

DualColumn.defaultProps = {
	list: [],
	isBackground: false,
};

DualColumn.propTypes = {
	list: PropsTypes.array,
	isBackground: PropsTypes.bool,
	background: PropsTypes.oneOf([
		'primary',
		'primary-light',
		'primary-dark',
		'secondary',
		'success',
		'success-dark',
		'warning',
		'info',
		'light',
		'dark',
	]),
};

export default DualColumn;
