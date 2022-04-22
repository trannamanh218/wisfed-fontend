import React from 'react';
import { Link } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import MyShelvesList from 'shared/my-shelves-list';
import QuotesLinks from 'shared/quote-links';
import ReadChallenge from 'shared/read-challenge';
import StatisticList from 'shared/statistic-list';
import PropTypes from 'prop-types';
import './sidebar-shelves.scss';
import { useSelector } from 'react-redux';
import { useFetchQuotes } from 'api/quote.hooks';
import { useFetchStatsReadingBooks } from 'api/library.hook';
import ChartsReading from 'shared/charts-Reading';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useParams } from 'react-router-dom';
import ProgressBarCircle from 'shared/progress-circle';
import { useFetchUserParams } from 'api/user.hook';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
const SidebarShelves = ({ isUpdate }) => {
	const { userId } = useParams();
	const { userData } = useFetchUserParams(userId);
	const { booksAuthor } = useFetchAuthorBooks(userData.firstName, userData.lastName);
	const { userInfo } = useSelector(state => state.auth);
	const { libraryData } = useSelector(state => state.library);
	const { booksReadYear } = useFetchTargetReading(userId);
	const libraryList = libraryData?.rows?.map(item => ({ ...item, quantity: item.books.length }));
	const { quoteData } = useFetchQuotes(
		1,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);

	const { readingData } = useFetchStatsReadingBooks(isUpdate);
	return (
		<div className='sidebar-shelves'>
			<StatisticList
				className='sidebar-shelves__reading__status'
				title='Trạng thái đọc'
				background='light'
				isBackground={true}
				list={readingData}
			/>
			<MyShelvesList list={libraryList} userId={userId} />
			<QuotesLinks
				list={quoteData}
				title={userId === userInfo.id ? 'Quotes của tôi' : `Quotes của ${userData.fullName}`}
			/>
			{booksAuthor.length > 0 && (
				<div className='my-compose'>
					<BookSlider
						className='book-reference__slider'
						title={`Sách của ${userData.fullName}`}
						list={booksAuthor}
					/>
					<Link className='view-all-link' to='/'>
						Xem thêm
					</Link>
				</div>
			)}

			{booksReadYear.length > 0 ? <ProgressBarCircle /> : <ReadChallenge />}
			<ChartsReading />
		</div>
	);
};

SidebarShelves.defaultProps = {
	libraryData: {},
	isUpdate: false,
};

SidebarShelves.propTypes = {
	libraryData: PropTypes.object,
	isUpdate: PropTypes.bool,
};

export default SidebarShelves;
