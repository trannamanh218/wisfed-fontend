import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import caretIcon from 'assets/images/caret.png';
import { DEFAULT_TOGGLE_ROWS, NUMBER_ROWS } from 'constants/index';
import './dual-column.scss';
import { useNavigate, useParams } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';
import { handleSetDefaultLibrary } from 'reducers/redux-utils/library';
import { useDispatch } from 'react-redux';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';

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
	const dispatch = useDispatch();
	const { userId } = useParams();

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
			navigate(RouteLink.categoryDetail(data.category.id, data.category.name));
		} else {
			if (!Storage.getAccessToken()) {
				dispatch(checkUserLogin(true));
			} else {
				dispatch(handleSetDefaultLibrary(data));
				navigate(`/shelves/${userId}`);
			}
		}
	};

	return (
		<>
			{list && list.length > 0 ? (
				<div className='dualColumn'>
					<ul className={classNames('dualColumn-list', { [`bg-${background}`]: isBackground })}>
						{list.slice(0, rows).map((item, index) => (
							<li
								className={classNames('dualColumn-item', { 'has-background': isBackground })}
								key={index}
							>
								<span
									className='dualColumn-item__title link'
									onClick={
										pageText
											? () => filterQuotesByCategory(item.id, item.name)
											: () => handleOnClick(item)
									}
								>
									{inCategory ? item.category.name : item.name}
								</span>

								{pageText ? (
									<span className='dualColumn-item__number'>{item?.countQuote} Quotes</span>
								) : (
									<span
										className='dualColumn-item__number no-page-text link'
										onClick={() => handleOnClick(item)}
									>
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
			) : (
				<p>Không có dữ liệu</p>
			)}
		</>
	);
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
