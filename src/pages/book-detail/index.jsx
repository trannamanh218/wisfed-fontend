import { useFetchBookDetail } from 'api/book.hooks';
import MainContainer from 'components/layout/main-container';
import NormalContainer from 'components/layout/normal-container';
import _ from 'lodash';
import React from 'react';
import BookInfo from './book-info';
import BookReference from './book-reference';

function BookDetail() {
	const { bookInfo } = useFetchBookDetail(55555);

	if (_.isEmpty(bookInfo)) {
		return (
			<NormalContainer>
				<h4 className='blank-content text-center mt-5 fs-4'>Không có dữ liệu</h4>
			</NormalContainer>
		);
	}

	return <MainContainer main={<BookInfo bookInfo={bookInfo} />} right={<BookReference />} />;
}

export default BookDetail;
