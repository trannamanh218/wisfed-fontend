import { useFetchBookDetail } from 'api/book.hooks';
import MainContainer from 'components/layout/main-container';
import NormalContainer from 'components/layout/normal-container';
import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import BookInfo from './book-info';
import BookReference from './book-reference';

function BookDetail() {
	const { id } = useParams();
	const { bookInfo } = useFetchBookDetail(id);

	if (_.isEmpty(bookInfo)) {
		return (
			<NormalContainer>
				<h4 className='blank-content text-center mt-5 fs-4'>Không có dữ liệu</h4>
			</NormalContainer>
		);
	}

	return <MainContainer main={<BookInfo />} right={<BookReference />} />;
}

export default BookDetail;
