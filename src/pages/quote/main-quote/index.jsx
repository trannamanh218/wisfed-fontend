import { useState, useEffect, useRef, useCallback } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getQuoteList, getMyLikedQuotes } from 'reducers/redux-utils/quote';
import './main-quote.scss';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { getUserDetail } from 'reducers/redux-utils/user';
import LoadingIndicator from 'shared/loading-indicator';
import PropTypes from 'prop-types';

const MainQuote = ({ setFoundUser }) => {
	const filterOptions = [
		{ id: 1, title: 'Của tôi', value: 'me' },
		{ id: 2, title: 'Yêu thích', value: 'me-like' },
	];

	const { userId } = useParams();

	const [quoteList, setQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [currentOption, setCurrentOption] = useState(filterOptions[0]);
	const [sortValue, setSortValue] = useState('like');
	const [sortDirection, setSortDirection] = useState('DESC');
	const [quotesUserName, setQuotesUserName] = useState('');
	const [isMyQuotes, setIsMyQuotes] = useState();
	const [inputSearchValue, setInputSearchValue] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState([]);
	const [getDataFirstTimeStatus, setGetDataFirsttimeStatus] = useState(true);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);
	const filterDefault = useRef([{ operator: 'eq', value: userId, property: 'createdBy' }]);

	const resetQuoteList = useSelector(state => state.quote.resetQuoteList);
	const userInfo = useSelector(state => state.auth.userInfo);

	const dispatch = useDispatch();

	useEffect(() => {
		setHasMore(true);
		callApiStart.current = 10;
		setInputSearchValue('');
		setFilter([]);
		getQuoteListFirstTime();
	}, [resetQuoteList, currentOption]);

	useEffect(() => {
		if (!getDataFirstTimeStatus) {
			setHasMore(true);
			callApiStart.current = 10;
			getQuoteListFirstTime();
		}
	}, [filter, sortValue, sortDirection]);

	useEffect(async () => {
		if (!_.isEmpty(userInfo)) {
			if (userId !== userInfo.id) {
				try {
					const user = await dispatch(getUserDetail(userId)).unwrap();
					setQuotesUserName(`Quotes của ${user.fullName || user.firstName + ' ' + user.lastName}`);
					setIsMyQuotes(false);
				} catch (err) {
					setFoundUser(false);
				}
			} else {
				setQuotesUserName('Quotes của tôi');
				setIsMyQuotes(true);
			}
		}
	}, [userInfo, userId]);

	const getQuoteListFirstTime = async () => {
		try {
			let quoteListData = [];
			if (currentOption.value === 'me') {
				const params = {
					start: 0,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
					filter: JSON.stringify(filterDefault.current.concat(filter)),
				};
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else {
				const params = {
					start: 0,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
					filter: JSON.stringify(filter),
				};
				const res = await dispatch(getMyLikedQuotes(params)).unwrap();
				quoteListData = res;
			}

			setQuoteList(quoteListData);
			if (!quoteListData.length || quoteListData.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setGetDataFirsttimeStatus(false);
			setIsLoading(false);
		}
	};

	const getQuoteListData = async () => {
		try {
			let quoteListData = [];
			if (currentOption.value === 'me') {
				const params = {
					start: callApiStart.current,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
					filter: JSON.stringify(filterDefault.current.concat(filter)),
				};
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else {
				const params = {
					start: callApiStart.current,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
					filter: JSON.stringify(filter),
				};
				const res = await dispatch(getMyLikedQuotes(params)).unwrap();
				quoteListData = res;
			}

			if (quoteListData.length) {
				callApiStart.current += callApiPerPage.current;
				setQuoteList(quoteList.concat(quoteListData));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChangeOption = item => {
		setCurrentOption(item);
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
		<>
			{!_.isEmpty(userInfo) && (
				<div className='main-quote'>
					<div className='main-quote__header'>
						<BackButton destination={-1} />
						<h4>{quotesUserName}</h4>
						<SearchField
							className='main-quote__search'
							placeholder='Tìm kiếm theo nội dung quotes'
							handleChange={onChangeInput}
							value={inputSearchValue}
						/>
					</div>
					<FilterQuotePane
						filterOptions={filterOptions}
						handleChangeOption={handleChangeOption}
						currentOption={currentOption}
						handleSortQuotes={handleSortQuotes}
						hasFilters={isMyQuotes}
					>
						{isLoading ? (
							<LoadingIndicator />
						) : (
							<>
								{quoteList.length > 0 ? (
									<InfiniteScroll
										dataLength={quoteList.length}
										next={getQuoteListData}
										hasMore={hasMore}
										loader={<LoadingIndicator />}
									>
										{quoteList.map(item => (
											<QuoteCard key={item.id} data={item} />
										))}
									</InfiniteScroll>
								) : (
									<>
										{inputSearchValue ? (
											<h4>Không có kết quả phù hợp</h4>
										) : (
											<h4>Chưa có dữ liệu</h4>
										)}
									</>
								)}
							</>
						)}
					</FilterQuotePane>
				</div>
			)}
		</>
	);
};

MainQuote.propTypes = {
	setFoundUser: PropTypes.func,
};

export default MainQuote;
