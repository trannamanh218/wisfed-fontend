import { Link } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import MyShelvesList from 'shared/my-shelves-list';
import QuotesLinks from 'shared/quote-links';
import StatisticList from 'shared/statistic-list';
import PropTypes from 'prop-types';
import './sidebar-shelves.scss';
import { useSelector } from 'react-redux';
import { useFetchQuotes } from 'api/quote.hooks';
import ChartsReading from 'shared/charts-Reading';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useParams } from 'react-router-dom';
import RenderProgress from 'shared/render-progress';
import ProgressBarCircle from 'shared/progress-circle';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import _ from 'lodash';

const SidebarShelves = ({ userData, isMyShelve, handleViewBookDetail }) => {
	const { userId } = useParams();
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const { userInfo } = useSelector(state => state.auth);
	const { booksReadYear } = useFetchTargetReading(userId);
	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);

	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	const handleRenderTargetReading = () => {
		if (userInfo.id === userId) {
			return <RenderProgress userIdParams={userId} />;
		} else {
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle booksReadYear={booksReadYear} />;
			}
			return '';
		}
	};

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

			{!!quoteData.length && (
				<QuotesLinks
					list={quoteData}
					title={userId === userInfo.id ? 'Quotes của tôi' : `Quotes của ${userData.fullName}`}
				/>
			)}

			{!!booksAuthor.length && (
				<div className='my-compose'>
					<BookSlider
						className='book-reference__slider'
						title={isMyShelve ? 'Sách tôi là tác giả' : `Sách của ${userData.fullName}`}
						list={booksAuthor}
						handleViewBookDetail={handleViewBookDetail}
					/>
					<Link className='view-all-link' to='/'>
						Xem thêm
					</Link>
				</div>
			)}
			{handleRenderTargetReading()}
			<ChartsReading />
		</div>
	);
};

SidebarShelves.defaultProps = {
	libraryData: {},
	isUpdate: false,
	handleViewBookDetail: () => {},
};

SidebarShelves.propTypes = {
	isMyShelve: PropTypes.bool,
	userData: PropTypes.object,
	handleViewBookDetail: PropTypes.func,
};

export default SidebarShelves;
