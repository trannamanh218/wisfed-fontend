import { Link } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import MyShelvesList from 'shared/my-shelves-list';
import QuotesLinks from 'shared/quote-links';
import StatisticList from 'shared/statistic-list';
import PropTypes from 'prop-types';
import './sidebar-shelves.scss';
import { useFetchQuotes } from 'api/quote.hooks';
import ChartsReading from 'shared/charts-Reading';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useParams } from 'react-router-dom';
import RenderProgress from 'shared/render-progress';
import ProgressBarCircle from 'shared/progress-circle';
import _ from 'lodash';
import { useFetchTargetReading } from 'api/readingTarget.hooks';

const SidebarShelves = ({ shelveGroupName, isMyShelve, handleViewBookDetail, allLibrary }) => {
	const { userId } = useParams();
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }])
	);

	const handleRenderTargetReading = () => {
		if (isMyShelve) {
			return <RenderProgress userIdParams={userId} />;
		} else {
			const { booksReadYear } = useFetchTargetReading(userId);
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle booksReadYear={booksReadYear} />;
			}
		}
	};

	return (
		<div className='sidebar-shelves'>
			{!_.isEmpty(allLibrary) && !!allLibrary.default.length && (
				<StatisticList
					className='sidebar-shelves__reading__status'
					title='Trạng thái đọc'
					background='light'
					isBackground={true}
					list={allLibrary.default}
					pageText={false}
				/>
			)}

			<MyShelvesList list={allLibrary.custom} />

			{!!quoteData.length && <QuotesLinks list={quoteData} title={`Quotes của ${shelveGroupName}`} />}

			{!!booksAuthor.length && (
				<div className='my-compose'>
					<BookSlider
						className='book-reference__slider'
						title={isMyShelve ? 'Sách tôi là tác giả' : `Sách của ${shelveGroupName}`}
						list={booksAuthor}
						handleViewBookDetail={handleViewBookDetail}
					/>
					<Link className='view-all-link' to={`/books-author/${userId}`}>
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
	isMyShelve: true,
	shelveGroupName: 'tôi',
	handleViewBookDetail: () => {},
	allLibrary: {},
};

SidebarShelves.propTypes = {
	isMyShelve: PropTypes.bool,
	shelveGroupName: PropTypes.string,
	handleViewBookDetail: PropTypes.func,
	allLibrary: PropTypes.object,
};

export default SidebarShelves;
