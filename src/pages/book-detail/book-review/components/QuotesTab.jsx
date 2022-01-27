import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FilterPane from 'shared/filter-pane';
import FitlerOptions from 'shared/filter-options';
import QuoteCard from 'shared/quote-card';

const QuotesTab = ({ list }) => {
	const filterOptions = [
		{ id: 1, title: 'Tất cả', value: 'all' },
		{ id: 2, title: 'Bạn bè', value: 'friends' },
		{ id: 3, title: 'Người theo dõi', value: 'followers' },
	];

	const [defaultOption, setDefaultOption] = useState({ id: 1, title: 'Tất cả', value: 'all' });

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

			{list.length
				? list.map((item, index) => <QuoteCard key={`quote-${index}`} data={item.data} badges={item.badges} />)
				: null}
		</FilterPane>
	);
};

QuotesTab.propTypes = {
	list: PropTypes.array,
};

export default QuotesTab;
