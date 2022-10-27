import MainContainer from 'components/layout/main-container';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import BookInfo from './book-info';
import BookReference from './book-reference';
import Circle from 'shared/loading/circle';
import { STATUS_LOADING } from 'constants/index';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookDetail } from 'reducers/redux-utils/book';
import NotFound from 'pages/not-found';

function BookDetail() {
	const dispatch = useDispatch();
	const [bookInformation, setBookInformation] = useState({});
	const [bookStatus, setBookStatus] = useState('LOADING');

	const { bookId } = useParams();

	const bookInfo = useSelector(state => state.book);

	const handleGetBookDetail = async () => {
		try {
			const res = await dispatch(getBookDetail(bookId)).unwrap();
			setBookInformation(res);
		} catch (err) {
			return;
		} finally {
			setBookStatus('SUCCESS');
		}
	};

	useEffect(() => {
		setTimeout(() => {
			window.scroll(0, 0);
		}, 300);
		if (_.isEmpty(bookInfo.bookInfo) || bookInfo.bookInfo.id != bookId) {
			// Gọi api
			handleGetBookDetail();
		} else {
			// Dùng redux
			setBookInformation(bookInfo.bookInfo);
			setBookStatus('SUCCESS');
		}
	}, [bookId]);

	return (
		<>
			{bookStatus === STATUS_LOADING ? (
				<Circle loading={true} />
			) : (
				<>
					{!_.isEmpty(bookInformation) ? (
						<MainContainer
							main={<BookInfo bookInfo={bookInformation} />}
							right={
								<BookReference bookInfo={bookInformation} handleGetBookDetail={handleGetBookDetail} />
							}
						/>
					) : (
						<NotFound />
					)}
				</>
			)}
		</>
	);
}

export default BookDetail;
