import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import caretIcon from 'assets/images/caret.png';
import { DEFAULT_TOGGLE_ROWS, NUMBER_ROWS } from 'constants';
import './dual-column.scss';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';

const DualColumn = props => {
	const {
		list,
		background,
		isBackground,
		pageText = true,
		inCategory = false,
		inQuotes = false,
		filterQuotesByCategory,
	} = props;
	const [isExpand, setIsExpand] = useState(false);

	let defaultItems;
	let maxItems;
	if (inQuotes) {
		defaultItems = 6;
		maxItems = 15;
	} else {
		defaultItems = DEFAULT_TOGGLE_ROWS;
		maxItems = NUMBER_ROWS;
	}

	const [rows, setRows] = useState(defaultItems);

	const navigate = useNavigate();

	const handleViewMore = () => {
		const length = list.length;
		let maxLength;

		if (inCategory) {
			maxLength = length;
		} else {
			if (length <= maxItems) {
				maxLength = length;
			} else {
				maxLength = maxItems;
			}
		}

		const newRows = isExpand ? defaultItems : maxLength;
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
								onClick={
									pageText
										? () => filterQuotesByCategory(item.id)
										: () => handleOnClick(item.category)
								}
								style={inCategory ? { cursor: 'pointer' } : {}}
							>
								{inCategory ? item.category.name : item.name}
							</span>

							{pageText ? (
								<span className='dualColumn-item__number'>{item?.quoteCount} Quotes</span>
							) : (
								<span className='dualColumn-item__number no-page-text'>
									{inCategory ? item.category.numberBooks : item.books.length}
								</span>
							)}
						</li>
					))}
				</ul>
				{list.length > defaultItems && (
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
	filterQuotesByCategory: PropTypes.func,
	inQuotes: PropTypes.bool,
};

export default memo(DualColumn);
