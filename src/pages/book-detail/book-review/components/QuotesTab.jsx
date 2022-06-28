import { useState, useEffect, useRef } from 'react';
import FilterPane from 'shared/filter-pane';
import FitlerOptions from 'shared/filter-options';
import QuoteCard from 'shared/quote-card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { getQuoteList, getQuotesByFriendsOrFollowers } from 'reducers/redux-utils/quote';
import LoadingIndicator from 'shared/loading-indicator';
import PropTypes from 'prop-types';

const QuotesTab = ({ currentTab }) => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'allQuotes' },
		{ id: 2, title: 'Bạn bè', value: 'friendsQuotes' },
		{ id: 3, title: 'Người theo dõi', value: 'followersQuotes' },
	];

	const [currentOption, setCurrentOption] = useState(filterOptions[0]);

	const [quoteList, setQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();
	const { bookId } = useParams();

	useEffect(() => {
		if (currentTab === 'quotes') {
			setHasMore(true);
			callApiStart.current = 10;
			getQuoteListDataFirstTime();
		}
	}, [currentOption, currentTab]);

	const getQuoteListDataFirstTime = async () => {
		try {
			let params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'eq', value: bookId, property: 'bookId' }]),
			};
			let quoteListData = [];
			if (currentOption.value === 'allQuotes') {
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else if (currentOption.value === 'friendsQuotes') {
				params = { ...params, type: 'friend' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			} else {
				params = { ...params, type: 'follow' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			}

			setQuoteList(quoteListData);
			if (quoteListData.length === 0 || quoteListData.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getQuoteListData = async () => {
		try {
			let params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'eq', value: bookId, property: 'bookId' }]),
			};
			let quoteListData = [];

			if (currentOption.value === 'allQuotes') {
				quoteListData = await dispatch(getQuoteList(params)).unwrap();
			} else if (currentOption.value === 'friendsQuotes') {
				params = { ...params, type: 'friend' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
			} else {
				params = { ...params, type: 'follow' };
				quoteListData = await dispatch(getQuotesByFriendsOrFollowers(params)).unwrap();
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

	return (
		<div className='quotes-tab'>
			<FilterPane title='Quotes'>
				<FitlerOptions
					list={filterOptions}
					currentOption={currentOption}
					handleChangeOption={handleChangeOption}
					name='filter-user'
					className='quotes-tab__filter__options'
				/>
				{currentTab === 'quotes' && quoteList.length > 0 ? (
					<InfiniteScroll
						dataLength={quoteList.length}
						next={getQuoteListData}
						hasMore={hasMore}
						loader={<LoadingIndicator />}
					>
						{quoteList.map(item => (
							<QuoteCard key={item.id} data={item} isDetail={false} />
						))}
					</InfiniteScroll>
				) : (
					<h5>Chưa có dữ liệu</h5>
				)}
			</FilterPane>
		</div>
	);
};

QuotesTab.propTypes = {
	currentTab: PropTypes.string,
};

export default QuotesTab;
