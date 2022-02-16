import React, { useState } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import './main-my-quote.scss';

const MainMyQuote = () => {
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
				{quotesList.length &&
					quotesList.map((item, index) => <QuoteCard key={index} data={item.data} badges={item.badges} />)}
			</FilterQuotePane>
		</div>
	);
};

MainMyQuote.propTypes = {};

export default MainMyQuote;
