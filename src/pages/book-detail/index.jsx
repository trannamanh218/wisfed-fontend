import { useFetchBookDetail } from 'api/book.hooks';
import MainContainer from 'components/layout/main-container';
import NormalContainer from 'components/layout/normal-container';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import BookInfo from './book-info';
import BookReference from './book-reference';
import Circle from 'shared/loading/circle';
import { STATUS_LOADING } from 'constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function BookDetail() {
	const [bookInformation, setBookInformation] = useState({});
	const [bookStatus, setBookStatus] = useState('');

	const bookInfo = useSelector(state => state.book);

	const useFetchGetBookDetail = async () => {
		const { bookId } = useParams();
		const { bookInfo, status } = useFetchBookDetail(bookId);
		setBookInformation(bookInfo);
		setBookStatus(status);
	};

	useEffect(() => {
		setTimeout(() => {
			window.scroll(0, 0);
		}, 300);

		if (bookInfo) {
			setBookInformation(bookInfo);
			setBookStatus('SUCCESS');
		} else {
			useFetchGetBookDetail();
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
