import QuoteCard from 'shared/quote-card';
import './quotes-search.scss';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
// import { NotificationError } from 'helpers/Error';
// import { checkLikeQuote } from 'reducers/redux-utils/quote';
// import { useDispatch } from 'react-redux';

const QuoteSearch = ({ listArrayQuotes }) => {
	const [likedArray, setLikedArray] = useState([1]);
	// const dispatch = useDispatch();

	// 	const getLikedArray = async () => {
	// 		try {
	// 			const res = await dispatch(checkLikeQuote()).unwrap();
	// 			setLikedArray(res);
	// 		} catch (err) {
	// 			NotificationError(err);
	// 		}
	// 	};
	//
	// 	useEffect(() => {
	// 		getLikedArray();
	// 	}, []);

	return (
		!!listArrayQuotes?.length &&
		listArrayQuotes.map(item => (
			<div key={item.id} className='quoteSearch__container'>
				<QuoteCard data={item} likedArray={likedArray} />
			</div>
		))
	);
};
QuoteSearch.propTypes = {
	listArrayQuotes: PropTypes.array,
};
export default QuoteSearch;
