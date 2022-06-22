import { useState, useEffect, useRef } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import { getQuoteList } from 'reducers/redux-utils/quote';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NotificationError } from 'helpers/Error';
import LoadingIndicator from 'shared/loading-indicator';

const MainAllQuotes = () => {
	const [allQuoteList, setAllQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [sortValue, setSortValue] = useState('like');
	const [sortDirection, setSortDirection] = useState('DESC');

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const resetQuoteList = useSelector(state => state.quote.resetQuoteList);

	const dispatch = useDispatch();

	useEffect(() => {
		callApiStart.current = 10;
		getAllQuoteListFirstTime();
	}, [resetQuoteList, sortValue, sortDirection]);

	const getAllQuoteListFirstTime = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
			};
			const quotesList = await dispatch(getQuoteList(params)).unwrap();
			if (quotesList.length > 0) {
				setAllQuoteList(quotesList);
				if (quotesList.length < callApiPerPage.current) {
					setHasMore(false);
				}
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getAllQuoteList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
			};
			const quotesList = await dispatch(getQuoteList(params)).unwrap();
			if (quotesList.length) {
				callApiStart.current += callApiPerPage.current;
				setAllQuoteList(allQuoteList.concat(quotesList));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleSortQuotes = params => {
		if (params === 'default') {
			setSortValue('like');
			setSortDirection('DESC');
		} else if (params === 'newest') {
			setSortValue('createdAt');
			setSortDirection('DESC');
		} else if (params === 'oldest') {
			setSortValue('createdAt');
			setSortDirection('ASC');
		}
	};

	return (
		<div className='main-quote'>
			<div className='main-quote__header'>
				<BackButton />
				<h4>Tất cả Quotes</h4>
				<SearchField className='main-quote__search' placeholder='Tìm kiếm theo sách, tác giả, chủ đề ...' />
			</div>
			<FilterQuotePane isMyQuotes={false} handleSortQuotes={handleSortQuotes}>
				{allQuoteList.length > 0 && (
					<InfiniteScroll
						dataLength={allQuoteList.length}
						next={getAllQuoteList}
						hasMore={hasMore}
						loader={<LoadingIndicator />}
					>
						{allQuoteList.map(item => (
							<QuoteCard key={item.id} data={item} />
						))}
					</InfiniteScroll>
				)}
			</FilterQuotePane>
		</div>
	);
};

export default MainAllQuotes;
