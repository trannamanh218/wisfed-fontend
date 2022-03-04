import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FilterPane from 'shared/filter-pane';
import FitlerOptions from 'shared/filter-options';
import QuoteList from 'shared/quote-list';
import { useFetchQuotes } from 'api/quote.hooks';
import { useSelector } from 'react-redux';

const QuotesTab = () => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'all' },
		{ id: 2, title: 'Bạn bè', value: 'friends' },
		{ id: 3, title: 'Người theo dõi', value: 'followers' },
	];

	const [defaultOption, setDefaultOption] = useState({ id: 1, title: 'Tất cả', value: 'all' });
	const { bookInfo } = useSelector(state => state.book);

	const {
		quoteData: { rows: quoteList = [] },
	} = useFetchQuotes(1, 10, JSON.stringify([{ 'operator': 'eq', 'value': bookInfo.id, 'property': 'bookId' }]));

	const handleChangeOption = (e, data) => {
		if (data.value !== defaultOption.value) {
			setDefaultOption(data);
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

			<QuoteList list={quoteList} />
		</FilterPane>
	);
};

QuotesTab.propTypes = {};

export default QuotesTab;
