import { useState, useEffect, useRef } from 'react';
import FilterPane from 'shared/filter-pane';
import FitlerOptions from 'shared/filter-options';
import QuoteCard from 'shared/quote-card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getQuoteList } from 'reducers/redux-utils/quote';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
const QuotesTab = () => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'all' },
		{ id: 2, title: 'Bạn bè', value: 'friends' },
		{ id: 3, title: 'Người theo dõi', value: 'followers' },
	];

	const [defaultOption, setDefaultOption] = useState({ id: 1, title: 'Tất cả', value: 'all' });

	const [myQuoteList, setMyQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const resetQuoteList = useSelector(state => state.quote.resetQuoteList);

	const dispatch = useDispatch();
	const { id } = useParams();

	const handleChangeOption = (e, data) => {
		if (data.value !== defaultOption.value) {
			setDefaultOption(data);
		}
	};

	useEffect(() => {
		callApiStart.current = 0;
		getMyQuoteList();
	}, [resetQuoteList]);

	const getMyQuoteList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'eq', value: id, property: 'bookId' }]),
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

	return (
		<FilterPane title='Quotes'>
			<FitlerOptions
				list={filterOptions}
				defaultOption={defaultOption}
				handleChangeOption={handleChangeOption}
				name='filter-user'
				className='quote-tab__filter__options'
			/>

			{myQuoteList.length > 0 ? (
				<InfiniteScroll
					dataLength={myQuoteList.length}
					next={getMyQuoteList}
					hasMore={hasMore}
					loader={<h4>Loading...</h4>}
				>
					{myQuoteList.map(item => (
						<QuoteCard key={item.id} data={item} />
					))}
				</InfiniteScroll>
			) : (
				<h5 style={{ margin: '2.5rem' }}>Không có dữ liệu</h5>
			)}
		</FilterPane>
	);
};

QuotesTab.propTypes = {};

export default QuotesTab;
