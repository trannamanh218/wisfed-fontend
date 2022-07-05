import StatisticList from 'shared/statistic-list';
import MyShelvesList from 'shared/my-shelves-list';
import { useDispatch } from 'react-redux';
import { useFetchQuotes } from 'api/quote.hooks';
import QuotesLinks from 'shared/quote-links';
import BookSlider from 'shared/book-slider';
import { Link } from 'react-router-dom';
import './sidebar-reading-summary.scss';
import { useFetchAuthorBooks } from 'api/book.hooks';
import _ from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { handleShelvesGroup } from 'api/shelvesGroup.hooks';
import RouteLink from 'helpers/RouteLink';
import Circle from 'shared/loading/circle';
import { NotificationError } from 'helpers/Error';
import { getBookDetail } from 'reducers/redux-utils/book';
import RenderProgress from 'shared/render-progress';
import ProgressBarCircle from 'shared/progress-circle';
import { useFetchTargetReading } from 'api/readingTarget.hooks';

const SidebarReadingSummary = () => {
	const [isViewBookDetailLoading, setIsViewBookDetailLoading] = useState(false);

	const { userId } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }])
	);
	const { booksReadYear } = useFetchTargetReading(userId);

	const { isLoading, shelveGroupName, isMine, allLibrary } = handleShelvesGroup(userId);
	const { booksAuthor } = useFetchAuthorBooks(userId);

	const handleRenderTargetReading = () => {
		if (isMine) {
			return <RenderProgress userIdParams={userId} />;
		} else {
			if (booksReadYear.length > 0) {
				return <ProgressBarCircle booksReadYear={booksReadYear} />;
			}
		}
	};

	const handleViewBookDetail = useCallback(async data => {
		setIsViewBookDetailLoading(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setIsViewBookDetailLoading(false);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	}, []);

	return (
		<div className='sidebar-reading-summary'>
			<Circle loading={isLoading || isViewBookDetailLoading} />
			{!_.isEmpty(allLibrary) && (
				<>
					{!!allLibrary.default.length && (
						<StatisticList
							className='sidebar-books-author__reading__status'
							title='Trạng thái đọc'
							background='light'
							isBackground={true}
							list={allLibrary.default}
							pageText={false}
						/>
					)}
					{!!allLibrary.custom.length && <MyShelvesList list={allLibrary.custom} />}
				</>
			)}
			<QuotesLinks list={quoteData} title='Quotes' />
			{!!booksAuthor.length && (
				<div className='my-compose'>
					<BookSlider
						className='book-reference__slider'
						title={isMine ? 'Sách tôi là tác giả' : `Sách của ${shelveGroupName}`}
						list={booksAuthor}
						handleViewBookDetail={handleViewBookDetail}
					/>
					<Link className='view-all-link' to={`/books-author/${userId}`}>
						Xem thêm
					</Link>
				</div>
			)}
			{handleRenderTargetReading()}
		</div>
	);
};

export default SidebarReadingSummary;
