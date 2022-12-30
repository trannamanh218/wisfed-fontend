import './main-quotes-by-category.scss';
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
import { useParams } from 'react-router-dom';
import { getCategoryDetail } from 'reducers/redux-utils/category';
import PropTypes from 'prop-types';

const MainQuotesByCategory = ({ setErrorLoadPage }) => {
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
	const [categoryName, setCategoryName] = useState('');

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const resetQuoteList = useSelector(state => state.quote.resetQuoteList);
	const categoryByQuotesName = useSelector(state => state.quote.categoryByQuotesName);
	const userInfo = useSelector(state => state.auth.userInfo);

	const { categoryId } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		window.scroll(0, 0);
		setHasMore(true);
		callApiStart.current = 10;
		setInputSearchValue('');
		setFilter([]);
		if (categoryByQuotesName) {
			setCategoryName(categoryByQuotesName);
		} else {
			getCategoryData();
		}
		getQuotesByCategoryFirstTime();
	}, [resetQuoteList, currentOption, categoryId]);

	useEffect(() => {
		if (!getDataFirstTimeStatus) {
			setHasMore(true);
			callApiStart.current = 10;
			getQuotesByCategoryFirstTime();
		}
	}, [filter, sortValue, sortDirection]);

	const getCategoryData = async () => {
		try {
			const res = await dispatch(getCategoryDetail(categoryId)).unwrap();
			setCategoryName(res.name);
		} catch (err) {
			setErrorLoadPage(true);
		}
	};

	const getQuotesByCategoryFirstTime = async () => {
		try {
			let params = {
				start: 0,
				limit: callApiPerPage.current,
				categoryId: categoryId,
				sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
				filter: JSON.stringify(filter),
			};
			let quoteListData = [];

			if (currentOption.value === 'all') {
				const res = await dispatch(getQuoteList(params)).unwrap();
				quoteListData = res.rows;
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

	const getQuotesByCategory = async () => {
		try {
			let params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				categoryId: categoryId,
				sort: JSON.stringify([{ property: sortValue, direction: sortDirection }]),
				filter: JSON.stringify(filter),
			};
			let quoteListData = [];

			if (currentOption.value === 'all') {
				const res = await dispatch(getQuoteList(params)).unwrap();
				quoteListData = res.rows;
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
		<div className='main-quotes-by-category'>
			<div className='main-quotes-by-category__header'>
				<BackButton destination={-1} />
				<h4>Quotes theo chủ đề "{categoryName.toLowerCase()}"</h4>
				<SearchField
					className='main-quotes-by-category__search'
					placeholder='Tìm kiếm nội dung quotes'
					handleChange={onChangeInput}
					value={inputSearchValue}
				/>
			</div>
			<FilterQuotePane
				filterOptions={!_.isEmpty(userInfo) ? filterOptions : []}
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
								next={getQuotesByCategory}
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

MainQuotesByCategory.propTypes = {
	setErrorLoadPage: PropTypes.func,
};

export default MainQuotesByCategory;
