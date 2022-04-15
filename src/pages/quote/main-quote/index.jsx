import { useState, useEffect, useRef } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import { getQuoteList } from 'reducers/redux-utils/quote';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { checkLikeQuote } from 'reducers/redux-utils/quote';
import './main-quote.scss';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { getUserDetail } from 'reducers/redux-utils/user';

const MainQuote = () => {
	const [myQuoteList, setMyQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [defaultOption, setDefaultOption] = useState({ id: 1, title: 'Tất cả', value: 'all' });
	const [likedArray, setLikedArray] = useState([]);
	const [sortValue, setSortValue] = useState('like');
	const [sortDirection, setSortDirection] = useState('DESC');
	const [quotesUserName, setQuotesUserName] = useState('');
	const [isMyQuotes, setIsMyQuotes] = useState();

	const filterOptions = [
		{ id: 1, title: 'Của tôi', value: 'me' },
		{ id: 2, title: 'Yêu thích', value: 'me-like' },
	];

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const resetQuoteList = useSelector(state => state.quote.resetQuoteList);
	const userInfo = useSelector(state => state.auth.userInfo);

	const { userId } = useParams();

	const dispatch = useDispatch();

	useEffect(() => {
		callApiStart.current = 10;
		getMyQuoteListFirstTime();
		getLikedArray();
	}, [resetQuoteList, sortValue, sortDirection]);

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

	const getMyQuoteListFirstTime = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
				filter: JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }]),
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
				filter: JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }]),
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

	const sortQuotes = params => {
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
						defaultOption={defaultOption}
						handleChange={sortQuotes}
						isMyQuotes={isMyQuotes}
					>
						{myQuoteList.length > 0 ? (
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
