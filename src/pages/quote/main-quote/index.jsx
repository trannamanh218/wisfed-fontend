import React, { useState } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import CreateQuote from '../create-quote';
import './main-quote.scss';

const MainQuote = () => {
	const quotesList = new Array(4).fill({
		data: {
			content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam velit nemo voluptate. Eaque tenetur
			dolore qui doloribus modi alias labore deleniti quisquam sunt. Accusantium, accusamus eius ipsum optio
			distinctio laborum.`,
			avatar: '',
			author: 'Mai Nguyễn',
			bookName: 'Đắc nhân tâm',
		},
		badges: [{ title: 'Marketing' }, { title: 'Phát triển bản thân' }],
	});

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
		<div className='main-quote'>
			<div className='main-quote__header'>
				<BackButton />
				<h4>Quotes của Adam</h4>
				<SearchField className='main-quote__search' placeholder='Tìm kiếm theo sách, tác giả, chủ đề ...' />
			</div>
			<CreateQuote />
			<FilterQuotePane
				filterOptions={filterOptions}
				handleChangeOption={handleChangeOption}
				defaultOption={defaultOption}
			>
				{quotesList.length &&
					quotesList.map((item, index) => <QuoteCard key={index} data={item.data} badges={item.badges} />)}
			</FilterQuotePane>
		</div>
	);
};

MainQuote.propTypes = {};

export default MainQuote;
