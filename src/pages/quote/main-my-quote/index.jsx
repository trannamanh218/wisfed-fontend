import React, { useState, useEffect, useRef } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import './main-my-quote.scss';
import { getQuoteList } from 'reducers/redux-utils/quote';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const MainMyQuote = () => {
	const [myQuoteList, setMyQuoteList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();

	useEffect(() => {
		getMyQuoteList();
	}, []);

	const getMyQuoteList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([
					{ operator: 'eq', value: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a', property: 'createdBy' },
				]),
			};
			const quotesList = await dispatch(getQuoteList(params)).unwrap();
			const { rows: quotes, count: totalQuote } = quotesList;
			if (quotes.length && callApiStart.current < totalQuote) {
				callApiStart.current += callApiPerPage.current;
				setMyQuoteList(myQuoteList.concat(quotes));
			} else {
				setHasMore(false);
			}
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const filterOptions = [
		{ id: 1, title: 'Của tôi', value: 'me' },
		{ id: 2, title: 'Yêu thích', value: 'me-like' },
	];

	const [defaultOption, setDefaultOption] = useState({ id: 1, title: 'Tất cả', value: 'all' });

	const handleChangeOption = (e, data) => {
		if (data.value !== defaultOption.value) {
			setDefaultOption(data);
		}
	};

	return (
		<div className='main-my-quote'>
			<div className='main-my-quote__header'>
				<BackButton />
				<h4>Quote của tôi</h4>
				<SearchField className='main-my-quote__search' placeholder='Tìm kiếm theo sách, tác giả, chủ đề ...' />
			</div>
			<FilterQuotePane
				filterOptions={filterOptions}
				handleChangeOption={handleChangeOption}
				defaultOption={defaultOption}
			>
				{myQuoteList.length &&
					myQuoteList.map(item => <QuoteCard key={item.id} data={item.data} badges={item.badges} />)}
			</FilterQuotePane>
		</div>
	);
};

MainMyQuote.propTypes = {};

export default MainMyQuote;
