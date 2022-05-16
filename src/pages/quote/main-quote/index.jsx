import { useState, useEffect, useRef } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { checkLikeQuote, getQuoteList, getMyLikedQuotes } from 'reducers/redux-utils/quote';
import './main-quote.scss';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { getUserDetail } from 'reducers/redux-utils/user';
import LoadingIndicator from 'shared/loading-indicator';

const MainQuote = () => {
	const filterOptions = [
		{ id: 1, title: 'Của tôi', value: 'me' },
		{ id: 2, title: 'Yêu thích', value: 'me-like' },
	];

	const [quoteList, setQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [currentOption, setCurrentOption] = useState(filterOptions[0]);
	const [likedArray, setLikedArray] = useState([]);
	const [sortValue, setSortValue] = useState('like');
	const [sortDirection, setSortDirection] = useState('DESC');
	const [quotesUserName, setQuotesUserName] = useState('');
	const [isMyQuotes, setIsMyQuotes] = useState();

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const resetQuoteList = useSelector(state => state.quote.resetQuoteList);
	const userInfo = useSelector(state => state.auth.userInfo);

	const { userId } = useParams();

	const dispatch = useDispatch();

	useEffect(() => {
		setHasMore(true);
		callApiStart.current = 10;
		getQuoteListFirstTime();
		getLikedArray();
	}, [resetQuoteList, sortValue, sortDirection, currentOption]);

	useEffect(async () => {
		if (!_.isEmpty(userInfo)) {
			if (userId !== userInfo.id) {
				const user = await dispatch(getUserDetail(userId)).unwrap();
				setQuotesUserName(`Quoets của ${user.fullName}`);
				setIsMyQuotes(false);
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
					filter: JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }]),
				};
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else {
				const params = {
					start: 0,
					limit: callApiPerPage.current,
					// sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
				};
				const res = await dispatch(getMyLikedQuotes(params)).unwrap();
				const newData = [];
				res.forEach(item => newData.push({ ...item, categories: [], tags: [] }));
				quoteListData = newData;
			}

			if (quoteListData.length) {
				setQuoteList(quoteListData);
				if (quoteListData.length < callApiPerPage.current) {
					setHasMore(false);
				}
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
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
					filter: JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }]),
				};
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else {
				const params = {
					start: callApiStart.current,
					limit: callApiPerPage.current,
					// sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
				};
				const res = await dispatch(getMyLikedQuotes(params)).unwrap();
				const newData = [];
				res.forEach(item => newData.push({ ...item, categories: [], tags: [] }));
				quoteListData = newData;
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

	const getLikedArray = async () => {
		try {
			const res = await dispatch(checkLikeQuote()).unwrap();
			setLikedArray(res);
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

	return (
		<>
			{!_.isEmpty(userInfo) && (
				<div className='main-my-quote'>
					<div className='main-my-quote__header'>
						<BackButton destination={-1} />
						<h4>{quotesUserName}</h4>
						<SearchField
							className='main-my-quote__search'
							placeholder='Tìm kiếm theo sách, tác giả, chủ đề ...'
						/>
					</div>
					<FilterQuotePane
						filterOptions={filterOptions}
						handleChangeOption={handleChangeOption}
						currentOption={currentOption}
						handleSortQuotes={handleSortQuotes}
						isMyQuotes={isMyQuotes}
					>
						{quoteList.length > 0 ? (
							<InfiniteScroll
								dataLength={quoteList.length}
								next={getQuoteListData}
								hasMore={hasMore}
								loader={<LoadingIndicator />}
							>
								{quoteList.map(item => (
									<QuoteCard key={item.id} data={item} likedArray={likedArray} />
								))}
							</InfiniteScroll>
						) : (
							<h4>Chưa có dữ liệu</h4>
						)}
					</FilterQuotePane>
				</div>
			)}
		</>
	);
};

export default MainQuote;
