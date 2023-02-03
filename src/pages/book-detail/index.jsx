import MainContainer from 'components/layout/main-container';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import BookInfo from './book-info';
import BookReference from './book-reference';
import Circle from 'shared/loading/circle';
import { STATUS_LOADING, BASE_URL } from 'constants';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookDetail } from 'reducers/redux-utils/book';
import NotFound from 'pages/not-found';
import { Helmet } from 'react-helmet';
import { strippedHTMLTags } from 'helpers/Common';

function BookDetail() {
	const dispatch = useDispatch();
	const [bookInformation, setBookInformation] = useState({});
	const [bookStatus, setBookStatus] = useState('LOADING');
	const [seoDescription, setSeoDescription] = useState('');
	// const [seoKeywords, setSeoKeywords] = useState(''); // k xóa
	const [seoImage, setSeoImage] = useState('');

	const { bookId } = useParams();

	const bookInfo = useSelector(state => state.book.bookInfo);

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
		if (_.isEmpty(bookInfo) || bookInfo.id != bookId) {
			handleGetBookDetail();
		} else {
			setBookInformation(bookInfo);
			setBookStatus('SUCCESS');
		}
	}, [bookId]);

	useEffect(() => {
		if (!_.isEmpty(bookInformation)) {
			const newDescription = strippedHTMLTags(bookInformation.description).slice(0, 300);
			setSeoDescription(newDescription);
			setSeoImage(`${BASE_URL}${bookInformation.frontBookCover}`);
		}
	}, [bookInformation]);

	return (
		<>
			<Helmet>
				<meta name='description' content={seoDescription} />
				<meta name='keywords' content='wisfeed, mạng xã hội, mang xa hoi, sách, sach, chia sẻ, chia se' />
				<meta name='news_keywords' content='wisfeed, mạng xã hội, mang xa hoi, sách, sach, chia sẻ, chia se' />
				<meta property='og:type' content='article' />
				<meta property='og:title' content={bookInformation.name} />
				<meta property='og:description' content={seoDescription} />
				<meta property='og:image' content={seoImage} />
			</Helmet>
			{bookStatus === STATUS_LOADING ? (
				<Circle loading={true} />
			) : (
				<>
					{!_.isEmpty(bookInformation) && !bookInformation.isDeleted ? (
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
