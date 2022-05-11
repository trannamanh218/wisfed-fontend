import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NUMBER_ROWS } from 'constants';
import { DEFAULT_TOGGLE_SINGLE_COLUMN_ROW } from 'constants';
import classNames from 'classnames';
import caretIcon from 'assets/images/caret.png';
import './toggle-list.scss';

const ToggleList = ({ title, list, className }) => {
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(DEFAULT_TOGGLE_SINGLE_COLUMN_ROW);

	const handleViewMore = () => {
		const length = list.length;
		if (length <= NUMBER_ROWS) {
			const maxLength = length < NUMBER_ROWS ? length : NUMBER_ROWS;
			const newRows = isExpand ? DEFAULT_TOGGLE_SINGLE_COLUMN_ROW : maxLength;
			setIsExpand(prev => !prev);
			return setRows(newRows);
		} else {
			if (rows < NUMBER_ROWS) {
				setRows(NUMBER_ROWS);
			}
		}
	};
	if (list && list.length) {
		return (
			<div className={classNames('toggle-container', { [`${className}`]: className })}>
				<h4>{title}</h4>
				<ul className='toggle-list'>
					{list.slice(0, rows).map((item, index) => (
						<li key={index} className='toggle-item'>
							<a>{item.title}</a>
						</li>
					))}
				</ul>

				{list.length > DEFAULT_TOGGLE_SINGLE_COLUMN_ROW && (
					<button className='toggle-btn' onClick={handleViewMore}>
						<img
							className={classNames('view-caret', { 'view-more': isExpand })}
							src={caretIcon}
							alt='caret-icon'
						/>
						<span>{isExpand ? 'Rút gọn' : 'Xem thêm'}</span>
					</button>
				)}
			</div>
		);
	}

	return null;
};

ToggleList.defaultProps = {
	list: [],
	title: '',
	className: '',
};

ToggleList.propTypes = {
	list: PropTypes.array,
	title: PropTypes.string,
	className: PropTypes.string,
};

export default ToggleList;
