import MainContainer from 'components/layout/main-container';
import React from 'react';
import BookInfo from './book-info';
import BookReference from './book-reference';

function BookDetail() {
	return <MainContainer main={<BookInfo />} right={<BookReference />} />;
}

export default BookDetail;
