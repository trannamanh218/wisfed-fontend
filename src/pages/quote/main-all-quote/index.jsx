import { useState, useEffect, useRef } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import { getQuoteList } from 'reducers/redux-utils/quote';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { checkLikeQuote } from 'reducers/redux-utils/quote';
import { NotificationError } from 'helpers/Error';

const MainAllQuotes = () => {
	const [myQuoteList, setMyQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [defaultOption, setDefaultOption] = useState({ id: 1, title: 'Tất cả', value: 'all' });
	const filterOptions = [
		{ id: 1, title: 'Của tôi', value: 'me' },
		{ id: 2, title: 'Yêu thích', value: 'me-like' },
	];
	const [likedArray, setLikedArray] = useState([]);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const resetQuoteList = useSelector(state => state.quote.resetQuoteList);

	const dispatch = useDispatch();

	useEffect(() => {
		callApiStart.current = 10;
		getMyQuoteListFirstTime();
		getLikedArray();
	}, [resetQuoteList]);

	const getMyQuoteListFirstTime = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const quotesList = await dispatch(getQuoteList(params)).unwrap();
			if (quotesList.length) {
				setMyQuoteList(quotesList);
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getMyQuoteList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const quotesList = await dispatch(getQuoteList(params)).unwrap();
			if (quotesList.length) {
				callApiStart.current += callApiPerPage.current;
				setMyQuoteList(myQuoteList.concat(quotesList));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getLikedArray = async () => {
		try {
			const res = await dispatch(checkLikeQuote()).unwrap();
			setLikedArray(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChangeOption = (e, data) => {
		if (data.value !== defaultOption.value) {
			setDefaultOption(data);
		}
	};

	return (
		<div className='main-my-quote'>
			<div className='main-my-quote__header'>
				<BackButton />
				<h4>Tất cả Quotes</h4>
				<SearchField className='main-my-quote__search' placeholder='Tìm kiếm theo sách, tác giả, chủ đề ...' />
			</div>
			<FilterQuotePane
				filterOptions={filterOptions}
				handleChangeOption={handleChangeOption}
				defaultOption={defaultOption}
			>
				{myQuoteList.length > 0 && (
					<InfiniteScroll
						dataLength={myQuoteList.length}
						next={getMyQuoteList}
						hasMore={hasMore}
						loader={<h4>Loading...</h4>}
					>
						{myQuoteList.map(item => (
							<QuoteCard key={item.id} data={item} likedArray={likedArray} />
						))}
					</InfiniteScroll>
				)}
			</FilterQuotePane>
		</div>
	);
};

MainAllQuotes.propTypes = {};

export default MainAllQuotes;
