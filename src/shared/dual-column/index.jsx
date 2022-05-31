import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import caretIcon from 'assets/images/caret.png';
import { DEFAULT_TOGGLE_ROWS } from 'constants';
import './dual-column.scss';
import { NUMBER_ROWS } from 'constants';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';

const DualColumn = props => {
	const { list, background, isBackground, pageText = true, inCategory = false } = props;
	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(DEFAULT_TOGGLE_ROWS);

	const navigate = useNavigate();

	const handleViewMore = () => {
		const length = list.length;
		let maxLength;

		if (inCategory) {
			maxLength = length;
		} else {
			if (length <= NUMBER_ROWS) {
				maxLength = length;
			} else {
				maxLength = NUMBER_ROWS;
			}
		}

		const newRows = isExpand ? DEFAULT_TOGGLE_ROWS : maxLength;
		setRows(newRows);
		setIsExpand(!isExpand);
	};

	const handleOnClick = data => {
		if (inCategory) {
			navigate(RouteLink.categoryDetail(data.id, data.name));
		}
	};

	if (list && list.length)
		return (
			<div className='dualColumn'>
				<ul className={classNames('dualColumn-list', { [`bg-${background}`]: isBackground })}>
					{list.slice(0, rows).map((item, index) => (
						<li className={classNames('dualColumn-item', { 'has-background': isBackground })} key={index}>
							<span
								className='dualColumn-item__title'
								onClick={() => handleOnClick(item.category)}
								style={inCategory ? { cursor: 'pointer' } : {}}
							>
								{inCategory ? item.category.name : item.name}
							</span>

							{pageText ? (
								<span className='dualColumn-item__number'>{item.books.length} cuốn</span>
							) : (
								<span className='dualColumn-item__number no-page-text'>
									{inCategory ? item.category.numberBooks : item.books.length}
								</span>
							)}
						</li>
					))}
				</ul>
				{list.length > DEFAULT_TOGGLE_ROWS && (
					<button className='dualColumn-btn' onClick={handleViewMore}>
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
	pageText: PropTypes.bool,
	inCategory: PropTypes.bool,
};

export default memo(DualColumn);
