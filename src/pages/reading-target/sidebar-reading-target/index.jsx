import { useSelector } from 'react-redux';
import StatisticList from 'shared/statistic-list';
import MyShelvesList from 'shared/my-shelves-list';
import { useFetchQuotes } from 'api/quote.hooks';
import QuotesLinks from 'shared/quote-links';
import './sidebar-reading-target.scss';
import { useParams, Link } from 'react-router-dom';
import { useFetchUserParams } from 'api/user.hook';
import _ from 'lodash';
import ChartsReading from 'shared/charts-Reading';
import { useFetchAuthorBooks } from 'api/book.hooks';
import BookSlider from 'shared/book-slider';

const SidebarReadingTarget = ({ handleViewBookDetail, isMyShelve }) => {
	const { userInfo } = useSelector(state => state.auth);
	const { userId } = useParams();
	const { userData } = useFetchUserParams(userId);
	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);

	const { booksAuthor } = useFetchAuthorBooks(userId);

	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	return (
		<div className='sidebar-reading-target'>
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
				title={userId === userInfo.id ? 'Quotes của tôi' : `Quotes của ${userData?.fullName}`}
			/>
			{!!booksAuthor.length && (
				<div className='my-compose'>
					<BookSlider
						className='book-reference__slider'
						title={isMyShelve ? 'Sách tôi là tác giả' : `Sách của ${userData.fullName}`}
						list={booksAuthor}
						handleViewBookDetail={handleViewBookDetail}
					/>
					<Link className='view-all-link' to={`/books-author/${userId}`}>
						Xem thêm
					</Link>
				</div>
			)}
			<ChartsReading />
		</div>
	);
};

SidebarReadingTarget.propTypes = {};

export default SidebarReadingTarget;
