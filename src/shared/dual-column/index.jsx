import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import caretIcon from 'assets/images/caret.png';
import { DEFAULT_TOGGLE_ROWS } from 'constants';
import './dual-column.scss';
import { NUMBER_ROWS } from 'constants';

const DualColumn = props => {
	const { list, background, isBackground } = props;
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(DEFAULT_TOGGLE_ROWS);

	const handleViewMore = () => {
		const length = list.length;
		if (length <= NUMBER_ROWS) {
			const maxLength = length < NUMBER_ROWS ? length : NUMBER_ROWS;
			const newRows = isExpand ? DEFAULT_TOGGLE_ROWS : maxLength;
			setIsExpand(prev => !prev);
			return setRows(newRows);
		} else {
			if (rows < NUMBER_ROWS) {
				setRows(NUMBER_ROWS);
			} else {
				setRows(length);
				setIsExpand(true);
			}
		}

		if (isExpand) {
			setRows(DEFAULT_TOGGLE_ROWS);
			setIsExpand(false);
		}
	};

	if (list && list.length)
		return (
			<div className='dualColumn'>
				<ul className={classNames('dualColumn-list', { [`bg-${background}`]: isBackground })}>
					{list.slice(0, rows).map((item, index) => (
						<li className={classNames('dualColumn-item', { 'has-background': isBackground })} key={index}>
							<span className='dualColumn-item__title'>{item.name}</span>
							<span className='dualColumn-item__number'>{item.quantity}</span>
						</li>
					))}
				</ul>
				{list.length > DEFAULT_TOGGLE_ROWS && (
					<button className='dualColumn-btn' onClick={handleViewMore}>
						<span>{isExpand ? 'Rút gọn' : 'Xem thêm'}</span>
					</button>
				)}
			</div>
		);

	return <p>Không có dữ liệu</p>;
};

DualColumn.defaultProps = {
	list: [],
	isBackground: false,
};

DualColumn.propTypes = {
	list: PropTypes.array,
	isBackground: PropTypes.bool,
	background: PropTypes.oneOf([
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
