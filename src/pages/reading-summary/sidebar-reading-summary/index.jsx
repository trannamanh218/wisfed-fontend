import React from 'react';
import { useFetchStatsReadingBooks } from 'api/library.hook';
import StatisticList from 'shared/statistic-list';
import MyShelvesList from 'shared/my-shelves-list';
import { useSelector } from 'react-redux';
import { useFetchQuotes } from 'api/quote.hooks';
import QuotesLinks from 'shared/quote-links';
import BookSlider from 'shared/book-slider';
import { Link } from 'react-router-dom';
import './sidebar-reading-summary.scss';

const SidebarReadingSummary = () => {
	const { userInfo } = useSelector(state => state.auth);
	const { libraryData } = useSelector(state => state.library);
	const libraryList = libraryData?.rows?.map(item => ({ ...item, quantity: item.books.length }));
	const { quoteData } = useFetchQuotes(
		1,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);

	const { readingData } = useFetchStatsReadingBooks();

	const myComposing = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });

	return (
		<div className='sidebar-reading-summary'>
			<StatisticList
				className='sidebar-shelves__reading__status'
				title='Trạng thái đọc'
				background='light'
				isBackground={true}
				list={readingData}
			/>
			<MyShelvesList list={libraryList} />
			<QuotesLinks list={quoteData} title='Quotes' />
			<div className='my-compose'>
				<BookSlider title='Sách tôi là tác giả' list={myComposing} />
				<Link className='view-all-link' to='/'>
					Xem thêm
				</Link>
			</div>
		</div>
	);
};

SidebarReadingSummary.propTypes = {};

export default SidebarReadingSummary;
