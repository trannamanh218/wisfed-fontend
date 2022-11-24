import QuoteCard from 'shared/quote-card';
import './quotes-search.scss';
import PropTypes from 'prop-types';
import { NotificationError } from 'helpers/Error';
import ResultNotFound from '../result-not-found';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from 'shared/loading-indicator';

const QuoteSearch = ({ value, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayQuotes, setListArrayQuotes] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(false);

	const { isShowModal } = useSelector(state => state.search);
	const dispatch = useDispatch();
	const callApiStartQuotes = useRef(0);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		if (activeKeyDefault === 'quotes') {
			setListArrayQuotes([]);
			callApiStartQuotes.current = 0;
			setHasMore(true);
		}
	}, [updateBooks, isShowModal, activeKeyDefault]);

	useEffect(() => {
		if (
			callApiStartQuotes.current === 0 &&
			listArrayQuotes.length === 0 &&
			searchResultInput &&
			activeKeyDefault === 'quotes'
		) {
			handleGetQuotesSearch();
		}
	}, [callApiStartQuotes.current, listArrayQuotes, value, isShowModal]);

	const handleGetQuotesSearch = async () => {
		if (listArrayQuotes.length === 0) {
			setIsLoadingFirstTime(true);
		}
		setIsFetching(true);
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStartQuotes.current,
				limit: callApiPerPage.current,
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			if (result.rows.length > 0) {
				callApiStartQuotes.current += callApiPerPage.current;
				setListArrayQuotes(listArrayQuotes.concat(result.rows));
			}
			// Nếu kết quả tìm kiếm nhỏ hơn limit thì disable gọi api khi scroll
			if (!result.rows.length || result.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
			setIsLoadingFirstTime(false);
		}
	};

	return (
		<div className='quoteSearch__container'>
			{isLoadingFirstTime ? (
				<LoadingIndicator />
			) : (
				<>
					{listArrayQuotes?.length > 0 && activeKeyDefault === 'quotes' ? (
						<InfiniteScroll
							next={handleGetQuotesSearch}
							dataLength={listArrayQuotes.length}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{listArrayQuotes.map(item => (
								<div key={item.id} className='quoteSearch__container__main'>
									<QuoteCard data={item} />
								</div>
							))}
						</InfiniteScroll>
					) : (
						isFetching === false && <ResultNotFound />
					)}
				</>
			)}
		</div>
	);
};
QuoteSearch.propTypes = {
	setIsFetching: PropTypes.func,
	activeKeyDefault: PropTypes.string,
	searchResultInput: PropTypes.string,
	value: PropTypes.string,
	updateBooks: PropTypes.bool,
	isFetching: PropTypes.bool,
	setIsLoadingFirstTime: PropTypes.func,
};
export default QuoteSearch;
