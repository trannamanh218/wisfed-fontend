import { useState, useEffect, useRef } from 'react';
import FilterPane from 'shared/filter-pane';
import FitlerOptions from 'shared/filter-options';
import QuoteCard from 'shared/quote-card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getQuoteList } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { checkLikeQuote } from 'reducers/redux-utils/quote';

const QuotesTab = () => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'all' },
		{ id: 2, title: 'Bạn bè', value: 'friends' },
		{ id: 3, title: 'Người theo dõi', value: 'followers' },
	];

	const [currentOption, setCurrentOption] = useState(filterOptions[0]);

	const [quoteList, setQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [likedArray, setLikedArray] = useState([]);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();
	const { bookId } = useParams();

	const handleChangeOption = item => {
		setCurrentOption(item);
	};

	useEffect(() => {
		getQuoteListData();
		getLikedArray();
	}, []);

	const getQuoteListData = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'eq', value: bookId, property: 'bookId' }]),
			};
			const quoteListData = await dispatch(getQuoteList(params)).unwrap();
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

	return (
		<div className='quotes-tab'>
			{quoteList.length ? (
				<FilterPane title='Quotes'>
					<FitlerOptions
						list={filterOptions}
						currentOption={currentOption}
						handleChangeOption={handleChangeOption}
						name='filter-user'
						className='quotes-tab__filter__options'
					/>

					<InfiniteScroll
						dataLength={quoteList.length}
						next={getQuoteListData}
						hasMore={hasMore}
						loader={<h4>Loading...</h4>}
					>
						{quoteList.map(item => (
							<QuoteCard key={item.id} data={item} likedArray={likedArray} />
						))}
					</InfiniteScroll>
				</FilterPane>
			) : (
				<h5>Chưa có dữ liệu</h5>
			)}
		</div>
	);
};

QuotesTab.propTypes = {};

export default QuotesTab;
