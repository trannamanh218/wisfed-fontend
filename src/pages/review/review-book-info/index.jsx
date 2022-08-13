import BookThumbnail from 'shared/book-thumbnail';
import ReactRating from 'shared/react-rating';
import ReadMore from 'shared/read-more';
import './review-book-info.scss';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getRatingBook } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';

const ReviewBookInfo = ({ bookInfo }) => {
	const [listRatingStar, setListRatingStar] = useState({});
	const [textLength, setTextLength] = useState(460);

	const dispatch = useDispatch();

	const getRatingData = async () => {
		try {
			const res = await dispatch(getRatingBook(bookInfo?.id)).unwrap();
			setListRatingStar(res.data);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		getRatingData();
	}, []);

	useEffect(() => {
		if (window.innerWidth <= 1024 && window.innerWidth > 820) {
			setTextLength(300);
		} else if (window.innerWidth <= 820) {
			setTextLength(250);
		}
	}, []);

	return (
		<div className='review-book-info'>
			<BookThumbnail className='review-book-info__image' size='lg' source={bookInfo.images[0]} />
			<div className='review-book-info__content'>
				<div className='review-book-info__name-author'>
					<h1 className='review-book-info__name'>{bookInfo.name}</h1>
					{!!bookInfo.authors.length && (
						<div className='review-book-info__author'>Bởi {bookInfo.authors[0].authorName}</div>
					)}
				</div>
				<div className='review-book-info__stars'>
					<ReactRating readonly={true} initialRating={listRatingStar?.avg} />
					<span>(Trung bình {listRatingStar?.avg} sao)</span>
				</div>

				<div className='review-book-info__description'>
					<ReadMore text={bookInfo.description} length={textLength} />
				</div>
			</div>
		</div>
	);
};

ReviewBookInfo.propTypes = {
	bookInfo: PropTypes.object,
};

export default ReviewBookInfo;
