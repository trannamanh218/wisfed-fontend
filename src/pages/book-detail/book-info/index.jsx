import PropTypes from 'prop-types';
import BookIntro from 'pages/book-detail/book-intro';
import BookReview from 'pages/book-detail/book-review';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getRatingBook } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';

const BookInfo = ({ bookInfo }) => {
	const dispatch = useDispatch();
	const [listRatingStar, setListRatingStar] = useState({});

	const fetchData = async () => {
		try {
			const res = await dispatch(getRatingBook(bookInfo?.id)).unwrap();
			setListRatingStar(res.data);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, [bookInfo]);

	return (
		<>
			<BookIntro bookInfo={bookInfo} listRatingStar={listRatingStar} />
			<BookReview listRatingStar={listRatingStar} />
		</>
	);
};

export default BookInfo;

BookInfo.propTypes = {
	bookInfo: PropTypes.object,
};
