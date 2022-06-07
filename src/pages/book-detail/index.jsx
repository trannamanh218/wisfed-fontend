import { useFetchBookDetail } from 'api/book.hooks';
import MainContainer from 'components/layout/main-container';
import NormalContainer from 'components/layout/normal-container';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import BookInfo from './book-info';
import BookReference from './book-reference';
import Circle from 'shared/loading/circle';
import { STATUS_LOADING } from 'constants';
import { useEffect } from 'react';

function BookDetail() {
	const { bookId } = useParams();
	const { bookInfo, status } = useFetchBookDetail(bookId);

	useEffect(() => {
		setTimeout(() => {
			window.scroll(0, 0);
		}, 300);
	}, []);

	return (
		<>
			{status === STATUS_LOADING ? (
				<Circle loading={true} />
			) : (
				<>
					{!_.isEmpty(bookInfo) ? (
						<MainContainer main={<BookInfo />} right={<BookReference />} />
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
