import { useFetchStatsReadingBooks } from 'api/library.hook';
import React from 'react';
import { useSelector } from 'react-redux';
import StatisticList from 'shared/statistic-list';
import MyShelvesList from 'shared/my-shelves-list';
import { useFetchQuotes } from 'api/quote.hooks';
import QuotesLinks from 'shared/quote-links';
import './sidebar-reading-target.scss';

const SidebarReadingTarget = () => {
	const { userInfo } = useSelector(state => state.auth);

	const { readingData } = useFetchStatsReadingBooks();
	const { libraryData } = useSelector(state => state.library);
	const libraryList = libraryData?.rows?.map(item => ({ ...item, quantity: item.books.length }));
	const { quoteData } = useFetchQuotes(
		1,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);
	return (
		<div className='sidebar-reading-target'>
			<StatisticList
				className='sidebar-shelves__reading__status'
				title='Trạng thái đọc'
				background='light'
				isBackground={true}
				list={readingData}
			/>
			<MyShelvesList list={libraryList} />
			<QuotesLinks list={quoteData} title='Quotes' />
		</div>
	);
};

SidebarReadingTarget.propTypes = {};

export default SidebarReadingTarget;
