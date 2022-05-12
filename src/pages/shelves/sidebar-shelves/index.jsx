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
import ChartsReading from 'shared/charts-Reading';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useParams } from 'react-router-dom';
import ProgressBarCircle from 'shared/progress-circle';
import _ from 'lodash';
import { useFetchTargetReading } from 'api/readingTarget.hooks';

const SidebarShelves = ({ userData, isMyShelve }) => {
	const { userId } = useParams();
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const { userInfo } = useSelector(state => state.auth);
	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);

	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	const { booksReadYear } = useFetchTargetReading(userId);

	return (
		<div className='sidebar-shelves'>
			{!_.isEmpty(myAllLibraryRedux) && myAllLibraryRedux.custom.length > 0 && (
				<>
					<StatisticList
						className='sidebar-shelves__reading__status'
						title='Trạng thái đọc'
						background='light'
						isBackground={true}
						list={myAllLibraryRedux.default}
						pageText={false}
					/>

					<MyShelvesList list={myAllLibraryRedux.custom} />
				</>
			)}

			<QuotesLinks
				list={quoteData}
				title={userId === userInfo.id ? 'Quotes của tôi' : `Quotes của ${userData.fullName}`}
			/>

			{booksAuthor.length > 0 && (
				<div className='my-compose'>
					<BookSlider
						className='book-reference__slider'
						title={isMyShelve ? 'Sách tôi là tác giả' : `Sách của ${userData.fullName}`}
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
	isMyShelve: PropTypes.bool,
	userData: PropTypes.object,
};

export default SidebarShelves;
