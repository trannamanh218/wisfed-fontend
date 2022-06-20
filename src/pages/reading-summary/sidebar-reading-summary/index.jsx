import StatisticList from 'shared/statistic-list';
import MyShelvesList from 'shared/my-shelves-list';
import { useSelector } from 'react-redux';
import { useFetchQuotes } from 'api/quote.hooks';
import QuotesLinks from 'shared/quote-links';
import BookSlider from 'shared/book-slider';
import { Link } from 'react-router-dom';
import './sidebar-reading-summary.scss';
import { useFetchAuthorBooks } from 'api/book.hooks';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const SidebarReadingSummary = ({ handleViewBookDetail, isMine }) => {
	const { userId } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const { booksAuthor } = useFetchAuthorBooks(userId);

	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userInfo.id, property: 'createdBy' }])
	);

	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	return (
		<div className='sidebar-reading-summary'>
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
			<QuotesLinks list={quoteData} title='Quotes' />
			<div className='my-compose'>
				{booksAuthor.length > 0 && (
					<>
						<BookSlider title='Sách tôi là tác giả' list={booksAuthor} />
						<Link className='view-all-link' to='/'>
							Xem thêm
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

SidebarReadingSummary.propTypes = {
	handleViewBookDetail: PropTypes.func,
	isMine: PropTypes.bool,
};

export default SidebarReadingSummary;
