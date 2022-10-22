import caretIcon from 'assets/images/caret.png';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuoteCard from 'shared/quote-card';
import './quote-list.scss';

const QuoteList = ({ list, type, userId }) => {
	const defaultItems = 3;
	const maxItems = 10;

	const [isExpand, setIsExpand] = useState(false);
	const [rows, setRows] = useState(defaultItems);

	const navigate = useNavigate();

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
		setIsExpand(true);
	};

	if (list && list.length > 0) {
		return (
			<div className='quote-list'>
				{list?.slice(0, rows).map(item => (
					<QuoteCard key={item.id} data={item.data || item} isDetail={false} />
				))}

				{list?.length > 3 && type === 'myQuotes' && (
					<button onClick={() => navigate(`/quotes/${userId}`)} className='sidebar__view-more-btn--blue'>
						Xem thêm
					</button>
				)}

				{list?.length > 3 && type !== 'myQuotes' && !isExpand && (
					<button
						className='dualColumn-btn'
						onClick={handleViewMore}
						style={{ justifyContent: 'flex-end', width: '100%' }}
					>
						<img className='view-caret' src={caretIcon} alt='caret-icon' />
						<span>Xem thêm</span>
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
	type: PropTypes.string,
};

export default QuoteList;
