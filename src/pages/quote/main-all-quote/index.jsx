import { useState, useEffect, useRef, useCallback } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import { getQuoteList, getQuotesByFriendsOrFollowers } from 'reducers/redux-utils/quote';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NotificationError } from 'helpers/Error';
import LoadingIndicator from 'shared/loading-indicator';
import _ from 'lodash';

const MainAllQuotes = () => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'all' },
		{ id: 2, title: 'Bạn bè', value: 'friends' },
		{ id: 3, title: 'Người Follow', value: 'followers' },
	];

	const [allQuoteList, setAllQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [sortValue, setSortValue] = useState('like');
	const [sortDirection, setSortDirection] = useState('DESC');
	const [currentOption, setCurrentOption] = useState(filterOptions[0]);
	const [inputSearchValue, setInputSearchValue] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState([]);
	const [getDataFirstTimeStatus, setGetDataFirsttimeStatus] = useState(true);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const resetQuoteList = useSelector(state => state.quote.resetQuoteList);

	const dispatch = useDispatch();

	useEffect(() => {
		setHasMore(true);
		callApiStart.current = 10;
		setInputSearchValue('');
		setFilter([]);
		getAllQuoteListFirstTime();
	}, [resetQuoteList, currentOption]);

	useEffect(() => {
		if (!getDataFirstTimeStatus) {
			setHasMore(true);
			callApiStart.current = 10;
			getAllQuoteListFirstTime();
		}
	}, [filter, sortValue, sortDirection]);

	const getAllQuoteListFirstTime = async () => {
		try {
			let params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
				filter: JSON.stringify(filter),
			};
			let quoteListData = [];

			if (currentOption.value === 'all') {
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else if (currentOption.value === 'friends') {
				params = { ...params, type: 'friend' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			} else {
				params = { ...params, type: 'follow' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			}

			setAllQuoteList(quoteListData);
			if (!quoteListData.length || quoteListData.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
			setGetDataFirsttimeStatus(false);
		}
	};

	const getAllQuoteList = async () => {
		try {
			let params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
				filter: JSON.stringify(filter),
			};
			let quoteListData = [];

			if (currentOption.value === 'all') {
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else if (currentOption.value === 'friends') {
				params = { ...params, type: 'friend' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			} else {
				params = { ...params, type: 'follow' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			}

			if (quoteListData.length) {
				callApiStart.current += callApiPerPage.current;
				setAllQuoteList(allQuoteList.concat(quoteListData));
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

	const handleChangeOption = item => {
		setCurrentOption(item);
	};

	const updateInputSearch = value => {
		if (value) {
			setFilter([{ 'operator': 'search', 'value': value.trim(), 'property': 'quote' }]);
		} else {
			setFilter([]);
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	const onChangeInput = e => {
		setIsLoading(true);
		setInputSearchValue(e.target.value);
		debounceSearch(e.target.value);
	};

	return (
		<div className='main-quote'>
			<div className='main-quote__header'>
				<BackButton />
				<h4>Tất cả Quotes</h4>
				<SearchField
					className='main-quote__search'
					placeholder='Tìm kiếm nội dung quotes'
					handleChange={onChangeInput}
					value={inputSearchValue}
				/>
			</div>
			<FilterQuotePane
				filterOptions={filterOptions}
				hasFilters={true}
				handleSortQuotes={handleSortQuotes}
				handleChangeOption={handleChangeOption}
				currentOption={currentOption}
			>
				{isLoading ? (
					<LoadingIndicator />
				) : (
					<>
						{allQuoteList.length > 0 ? (
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
						) : (
							<>{inputSearchValue ? <h4>Không có kết quả phù hợp</h4> : <h4>Chưa có dữ liệu</h4>}</>
						)}
					</>
				)}
			</FilterQuotePane>
		</div>
	);
};

export default MainAllQuotes;
