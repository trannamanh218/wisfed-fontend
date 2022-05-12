import { useFetchStatsReadingBooks } from 'api/library.hook';
import React from 'react';
import { useSelector } from 'react-redux';
import StatisticList from 'shared/statistic-list';
import MyShelvesList from 'shared/my-shelves-list';
import { useFetchQuotes } from 'api/quote.hooks';
import QuotesLinks from 'shared/quote-links';
import './sidebar-reading-target.scss';
import { useParams } from 'react-router-dom';
import { useFetchUserParams } from 'api/user.hook';

const SidebarReadingTarget = () => {
	const { userInfo } = useSelector(state => state.auth);
	const { userId } = useParams();
	const { readingData } = useFetchStatsReadingBooks();
	const { userData } = useFetchUserParams(userId);
	const { libraryData } = useSelector(state => state.library);
	const libraryList = libraryData?.rows?.map(item => ({ ...item, quantity: item.books.length }));
	const { quoteData } = useFetchQuotes(
		1,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);
	return (
		<div className='sidebar-reading-target'>
			{/* <StatisticList
				className='sidebar-shelves__reading__status'
				title='Trạng thái đọc'
				background='light'
				isBackground={true}
				list={readingData}
			/> */}
			<MyShelvesList list={libraryList} />
			<QuotesLinks
				list={quoteData}
				title={userId === userInfo.id ? 'Quotes của tôi' : `Quotes của ${userData.fullName}`}
			/>
		</div>
	);
};

SidebarReadingTarget.propTypes = {};

export default SidebarReadingTarget;
