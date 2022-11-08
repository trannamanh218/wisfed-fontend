import StatisticList from 'shared/statistic-list';
import MyShelvesList from 'shared/my-shelves-list';
import { useFetchQuotes } from 'api/quote.hooks';
import QuotesLinks from 'shared/quote-links';
import './sidebar-reading-target.scss';
import { useParams, Link } from 'react-router-dom';
import _ from 'lodash';
import ChartsReading from 'shared/charts-Reading';
import { useFetchAuthorBooks } from 'api/book.hooks';
import BookSlider from 'shared/book-slider';
import { handleShelvesGroup } from 'api/shelvesGroup.hooks';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getBookDetail } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';
import Circle from 'shared/loading/circle';

const SidebarReadingTarget = () => {
	const [isViewBookDetailLoading, setIsViewBookDetailLoading] = useState(false);

	const { userId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }])
	);

	const { isLoading, shelveGroupName, isMine, allLibrary } = handleShelvesGroup(userId);

	const { booksAuthor } = useFetchAuthorBooks(userId);

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
		<div className='sidebar-reading-target'>
			<Circle loading={isLoading || isViewBookDetailLoading} />
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
			<QuotesLinks list={quoteData} title={`Quotes của ${shelveGroupName}`} />
			{!!booksAuthor.length > 0 && (
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
			<ChartsReading />
		</div>
	);
};

export default SidebarReadingTarget;
