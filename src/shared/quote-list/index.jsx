import caretIcon from 'assets/images/caret.png';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import QuoteCard from 'shared/quote-card';
import './quote-list.scss';

const QuoteList = ({ list }) => {
	const defaultItems = 3;
	const maxItems = 10;

	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(defaultItems);

	const handleViewMore = () => {
		const length = list.length;
		let maxLength;

		if (length <= maxItems) {
			maxLength = length;
		} else {
			maxLength = maxItems;
		}

		const newRows = isExpand ? defaultItems : maxLength;
		setRows(newRows);
		setIsExpand(!isExpand);
	};

	if (list && list.length > 0) {
		return (
			<div className='quote-list'>
				{list?.slice(0, rows).map(item => (
					<QuoteCard key={item.id} data={item.data || item} isDetail={false} />
				))}

				{list?.length > 3 && (
					<button
						className='dualColumn-btn'
						onClick={handleViewMore}
						style={{ justifyContent: 'flex-end', width: '100%' }}
					>
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

	return <p className='blank-content'>Không có dữ liệu</p>;
};

QuoteList.propTypes = {
	list: PropTypes.array.isRequired,
	userId: PropTypes.string,
};

export default QuoteList;
