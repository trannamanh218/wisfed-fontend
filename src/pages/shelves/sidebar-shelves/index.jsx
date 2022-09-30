import { useFetchAuthorBooks } from 'api/book.hooks';
import { useFetchQuotes } from 'api/quote.hooks';
import { useFetchTargetReading } from 'api/readingTarget.hooks';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import ChartsReading from 'shared/charts-Reading';
import MyShelvesList from 'shared/my-shelves-list';
import ProgressBarCircle from 'shared/progress-circle';
import QuotesLinks from 'shared/quote-links';
import RenderProgress from 'shared/render-progress';
import StatisticList from 'shared/statistic-list';
import './sidebar-shelves.scss';

const SidebarShelves = ({ shelveGroupName, isMyShelve, handleViewBookDetail, allLibrary }) => {
	const { userId } = useParams();
	const { booksReadYear } = useFetchTargetReading(userId);
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }])
	);

	const handleRenderTargetReading = useCallback(() => {
		if (isMyShelve) {
			return <RenderProgress userIdParams={userId} />;
		} else {
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle booksReadYear={booksReadYear} />;
			}
		}
	}, [isMyShelve]);

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
