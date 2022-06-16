import { Link } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import MyShelvesList from 'shared/my-shelves-list';
import QuotesLinks from 'shared/quote-links';
import StatisticList from 'shared/statistic-list';
import PropTypes from 'prop-types';
import './sidebar-shelves.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchQuotes } from 'api/quote.hooks';
import ChartsReading from 'shared/charts-Reading';
import { useFetchAuthorBooks } from 'api/book.hooks';
import { useParams } from 'react-router-dom';
import RenderProgress from 'shared/render-progress';
import ProgressBarCircle from 'shared/progress-circle';
import _ from 'lodash';
import { NotificationError } from 'helpers/Error';
import { getListBooksTargetReading } from 'reducers/redux-utils/chart';
import { useState, useEffect } from 'react';

const SidebarShelves = ({ shelveGroupName, isMyShelve, handleViewBookDetail }) => {
	const [booksReadYear, setBookReadYear] = useState({});

	const { userId } = useParams();
	const { booksAuthor } = useFetchAuthorBooks(userId);
	const { userInfo } = useSelector(state => state.auth);
	const { quoteData } = useFetchQuotes(
		0,
		3,
		JSON.stringify([{ operator: 'eq', value: userId.id, property: 'createdBy' }])
	);

	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!isMyShelve) {
			getTargetReadingOfOtherUser();
		}
	}, []);

	const getTargetReadingOfOtherUser = async () => {
		try {
			const data = await dispatch(getListBooksTargetReading(userId)).unwrap();
			const year = new Date().getFullYear();
			const newData = data.filter(item => item.year === year);
			if (newData.length) {
				setBookReadYear(newData[0]);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleRenderTargetReading = () => {
		if (isMyShelve) {
			return <RenderProgress userId={userId} />;
		} else {
			if (!_.isEmpty(booksReadYear)) {
				return <ProgressBarCircle booksReadYearData={booksReadYear} />;
			}
		}
	};

	console.log(booksReadYear);

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
					title={userId === userInfo.id ? 'Quotes của tôi' : `Quotes của ${shelveGroupName}`}
				/>
			)}

			{!!booksAuthor.length && (
				<div className='my-compose'>
					<BookSlider
						className='book-reference__slider'
						title={isMyShelve ? 'Sách tôi là tác giả' : `Sách của ${shelveGroupName}`}
						list={booksAuthor}
						handleViewBookDetail={handleViewBookDetail}
					/>
					<Link className='view-all-link' to={`/book-author/${userId}`}>
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
};

SidebarShelves.propTypes = {
	isMyShelve: PropTypes.bool,
	shelveGroupName: PropTypes.string,
	handleViewBookDetail: PropTypes.func,
};

export default SidebarShelves;
