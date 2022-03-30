import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QuoteCard from 'shared/quote-card';
import './quote-list.scss';
import { checkLikeQuote } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const QuoteList = ({ list }) => {
	const [likedArray, setLikedArray] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		getLikedArray();
	}, []);

	const getLikedArray = async () => {
		try {
			const res = await dispatch(checkLikeQuote()).unwrap();
			setLikedArray(res);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	if (list && list.length > 0) {
		return (
			<div className='quote-list'>
				{list.map((item, index) => (
					<QuoteCard
						key={`quote-${index}`}
						data={item.data || item}
						badges={item.badges}
						likedArray={likedArray}
						isDetail={false}
					/>
				))}
			</div>
		);
	}

	return <p className='blank-content'>Không có dữ liệu</p>;
};

QuoteList.propTypes = {
	list: PropTypes.array.isRequired,
};

export default QuoteList;
