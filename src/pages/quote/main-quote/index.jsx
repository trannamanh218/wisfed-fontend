import React, { useState } from 'react';
import BackButton from 'shared/back-button';
import FilterQuotePane from 'shared/fitler-quote-pane';
import QuoteCard from 'shared/quote-card';
import SearchField from 'shared/search-field';
import './main-quote.scss';

const MainQuote = () => {
	const quotesList = new Array(4).fill({
		id: 20,
		bookId: 77999,
		authorName: 'Yuval Noah Harari',
		quote: 'lieu thi an nhieu',
		background: 'to bottom right, #3F74D0, #69C8DE, #A6E1CF',
		tagId: 10,
		createdBy: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		updatedBy: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a',
		createdAt: '2022-02-25T07:55:10.538Z',
		updatedAt: '2022-02-25T07:55:10.538Z',
		book: {
			name: 'Lãng Khách Kenshin Tập 22: Trận Chiến Tam Cực',
			description:
				'Lãng Khách Kenshin Tập 22: Trận Chiến Tam Cực,Nhằm  phá  vỡ  cục  diện  bế  tắc  của  trận chiến,  Sangou  Iwanbou  cùng  Gein  đã nhảy  xuống  đất.  Trận  chiến  phân  thành  ba cực!  Sanosuke  đấu  Inui  Banjin,  Yahiko  đấu Otowa,  còn  Kenshin  đấu  với  Iwanbou  số  ba! Tình hình mỗi trận đấu sẽ ra sao!?',
			frontBookCover: null,
			categoryId: 16,
			verify: false,
		},
		user: {
			fullName: 'admin user1',
			email: 'admin@gmail.com',
			avatarImage:
				'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
		},
		categories: [
			{
				quoteId: 20,
				category: {
					name: 'Manga-Commic',
					slug: null,
				},
			},
		],
		tag: {
			name: 'hot',
			slug: 'hot',
		},
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
				<BackButton destination={-1} />
				<h4>Quotes của Adam</h4>
				<SearchField className='main-quote__search' placeholder='Tìm kiếm theo sách, tác giả, chủ đề ...' />
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

MainQuote.propTypes = {};

export default MainQuote;
