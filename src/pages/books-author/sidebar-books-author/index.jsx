import MyShelvesList from 'shared/my-shelves-list';
import QuotesLinks from 'shared/quote-links';
import StatisticList from 'shared/statistic-list';
import PropTypes from 'prop-types';
import './sidebar-books-author.scss';
import { useSelector } from 'react-redux';
import { useFetchQuotes } from 'api/quote.hooks';
import ChartsReading from 'shared/charts-Reading';
import { useParams } from 'react-router-dom';
import RenderProgress from 'shared/render-progress';
import ProgressBarCircle from 'shared/progress-circle';
import _ from 'lodash';
import { useFetchTargetReading } from 'api/readingTarget.hooks';

const SidebarBooksAuthor = ({ shelveGroupName, isMine, allLibrary }) => {
	const { userId } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }])
	);

	const { booksReadYear } = useFetchTargetReading(userId);

	const handleRenderTargetReading = () => {
		if (isMine) {
			return <RenderProgress userIdParams={userId} />;
		} else {
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle booksReadYear={booksReadYear} />;
			}
		}
	};

	return (
		<div className='sidebar-books-author'>
			{!_.isEmpty(allLibrary) && (
				<>
					{!!allLibrary.default.length > 0 && (
						<StatisticList
							className='sidebar-books-author__reading__status'
							title='Trạng thái đọc'
							background='light'
							isBackground={true}
							list={allLibrary.default}
							pageText={false}
						/>
					)}
					{!!allLibrary.custom.length > 0 && <MyShelvesList list={allLibrary.custom} />}
				</>
			)}

			{!!quoteData.length > 0 && (
				<QuotesLinks
					list={quoteData}
					title={userId === userInfo.id ? 'Quotes của tôi' : `Quotes của ${shelveGroupName}`}
				/>
			)}

			{handleRenderTargetReading()}
			<ChartsReading />
		</div>
	);
};

SidebarBooksAuthor.defaultProps = {
	isMine: true,
	shelveGroupName: 'tôi',
	allLibrary: {},
};

SidebarBooksAuthor.propTypes = {
	isMine: PropTypes.bool,
	shelveGroupName: PropTypes.string,
	allLibrary: PropTypes.object,
};

export default SidebarBooksAuthor;
