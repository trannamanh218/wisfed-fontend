import QuoteCard from 'shared/quote-card';
import './quotes-search.scss';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { NotificationError } from 'helpers/Error';
import { checkLikeQuote } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import ResultNotFound from '../result-not-found';
import InfiniteScroll from 'react-infinite-scroll-component';
import Circle from 'shared/loading/circle';

const QuoteSearch = ({ listArrayQuotes, hasMore, handleGetBooksSearch, isFetching }) => {
	const [likedArray, setLikedArray] = useState([1]);
	const dispatch = useDispatch();

	const getLikedArray = async () => {
		try {
			const res = await dispatch(checkLikeQuote()).unwrap();
			setLikedArray(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		getLikedArray();
	}, []);

	return (
		<div className='quoteSearch__container'>
			{listArrayQuotes?.length > 0 ? (
				<InfiniteScroll
					next={handleGetBooksSearch}
					dataLength={listArrayQuotes.length}
					hasMore={hasMore}
					loader={<Circle loading={isFetching} />}
				>
					{listArrayQuotes.map(item => (
						<div key={item.id} className='quoteSearch__container__main'>
							<QuoteCard data={item} likedArray={likedArray} />
						</div>
					))}
				</InfiniteScroll>
			) : (
				<ResultNotFound />
			)}
		</div>
	);
};
QuoteSearch.propTypes = {
	listArrayQuotes: PropTypes.array,
	hasMore: PropTypes.bool,
	handleGetBooksSearch: PropTypes.func,
	isFetching: PropTypes.bool,
};
export default QuoteSearch;
