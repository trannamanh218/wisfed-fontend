import MainContainer from 'components/layout/main-container';
import NormalContainer from 'components/layout/normal-container';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import BookInfo from './book-info';
import BookReference from './book-reference';
import Circle from 'shared/loading/circle';
import { STATUS_LOADING } from 'constants';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookDetail } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';

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
			setBookStatus('SUCCESS');
		} catch (err) {
			NotificationError(err);
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
	}, []);
	return (
		<>
			{bookStatus === STATUS_LOADING ? (
				<Circle loading={true} />
			) : (
				<>
					{!_.isEmpty(bookInformation) ? (
						<MainContainer
							main={<BookInfo bookInfo={bookInformation} />}
							right={<BookReference bookInfo={bookInformation} />}
						/>
					) : (
						<NormalContainer>
							<h4 className='blank-content text-center mt-5 fs-4'>Không có dữ liệu</h4>
						</NormalContainer>
					)}
				</>
			)}
		</>
	);
}

export default BookDetail;
