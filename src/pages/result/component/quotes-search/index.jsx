import QuoteCard from 'shared/quote-card';
import './quotes-search.scss';
import PropTypes from 'prop-types';
import { NotificationError } from 'helpers/Error';
import { checkLikeQuote } from 'reducers/redux-utils/quote';
import ResultNotFound from '../result-not-found';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFilterSearchAuth, getFilterSearch } from 'reducers/redux-utils/search';
import Storage from 'helpers/Storage';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from 'shared/loading-indicator';

const QuoteSearch = ({
	isFetching,
	value,
	reload,
	setIsFetching,
	searchResultInput,
	activeKeyDefault,
	updateBooks,
}) => {
	const [likedArray, setLikedArray] = useState([1]);
	const [listArrayQuotes, setListArrayQuotes] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [hasMore, setHasMore] = useState(true);
	const dispatch = useDispatch();
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);
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

	useEffect(() => {
		if (activeKeyDefault === 'quotes') {
			setListArrayQuotes([]);
			callApiStart.current = 0;
			setHasMore(true);
		}
	}, [reload, updateBooks, isShowModal, activeKeyDefault]);

	useEffect(() => {
		if (
			callApiStart.current === 0 &&
			listArrayQuotes.length === 0 &&
			searchResultInput &&
			activeKeyDefault === 'quotes'
		) {
			handleGetQuotesSearch();
		}
	}, [callApiStart.current, listArrayQuotes, value, isShowModal]);

	const handleGetQuotesSearch = async () => {
		setIsFetching(true);
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};
			if (activeKeyDefault === 'quotes') {
				if (Storage.getAccessToken()) {
					const result = await dispatch(getFilterSearchAuth(params)).unwrap();
					if (result.rows.length > 0) {
						callApiStart.current += callApiPerPage.current;
						setListArrayQuotes(listArrayQuotes.concat(result.rows));
					} else {
						setHasMore(false);
					}
				} else {
					const result = await dispatch(getFilterSearch(params)).unwrap();
					if (result.rows.length > 0) {
						callApiStart.current += callApiPerPage.current;
						setListArrayQuotes(listArrayQuotes.concat(result.rows));
					} else {
						setHasMore(false);
					}
				}
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<div className='quoteSearch__container'>
			{listArrayQuotes?.length > 0 ? (
				<InfiniteScroll
					next={handleGetQuotesSearch}
					dataLength={listArrayQuotes.length}
					hasMore={hasMore}
					loader={<LoadingIndicator />}
				>
					{listArrayQuotes.map(item => (
						<div key={item.id} className='quoteSearch__container__main'>
							<QuoteCard data={item} likedArray={likedArray} />
						</div>
					))}
				</InfiniteScroll>
			) : (
				isFetching === false && <ResultNotFound />
			)}
		</div>
	);
};
QuoteSearch.propTypes = {
	reload: PropTypes.bool,
	setIsFetching: PropTypes.func,
	activeKeyDefault: PropTypes.string,
	searchResultInput: PropTypes.string,
	value: PropTypes.string,
	updateBooks: PropTypes.bool,
	isFetching: PropTypes.bool,
};
export default QuoteSearch;
