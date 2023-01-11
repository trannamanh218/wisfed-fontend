import PropTypes from 'prop-types';
import BookIntro from 'pages/book-detail/book-intro';
import BookReview from 'pages/book-detail/book-review';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRatingBook } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import ReviewRating from 'shared/review-rating';
import './book-info.scss';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

const generalInfoLabel = ['NXB / Công ty sách', 'Số trang', 'Khổ sách', 'ISBN', 'Ngày xuất bản'];

const BookInfo = ({ bookInfo }) => {
	const dispatch = useDispatch();
	const [listRatingStar, setListRatingStar] = useState({});
	const [listRating, setListRating] = useState([]);

	const { refreshRatingData } = useSelector(state => state.book);

	const fetchData = async () => {
		try {
			const res = await dispatch(getRatingBook(bookInfo?.id)).unwrap();
			setListRatingStar(res.data);
			const ratingList = [
				{
					level: 5,
					percent:
						(res.data.rate_5_star / res.data.count) * 100
							? (res.data.rate_5_star / res.data.count).toFixed(2) * 100
							: 0,
					total: res.data.rate_5_star,
				},
				{
					level: 4,
					percent:
						(res.data.rate_4_star / res.data.count) * 100
							? (res.data.rate_4_star / res.data.count).toFixed(2) * 100
							: 0,
					total: res.data.rate_4_star,
				},
				{
					level: 3,
					percent:
						(res.data.rate_3_star / res.data.count) * 100
							? (res.data.rate_3_star / res.data.count).toFixed(2) * 100
							: 0,
					total: res.data.rate_3_star,
				},
				{
					level: 2,
					percent:
						(res.data.rate_2_star / res.data.count) * 100
							? (res.data.rate_2_star / res.data.count).toFixed(2) * 100
							: 0,
					total: res.data.rate_2_star,
				},
				{
					level: 1,
					percent:
						(res.data.rate_1_star / res.data.count) * 100
							? (res.data.rate_1_star / res.data.count).toFixed(2) * 100
							: 0,
					total: res.data.rate_1_star,
				},
			];
			setListRating(ratingList);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, [bookInfo, refreshRatingData]);

	const renderPublisherDate = dateData => {
		if (dateData) {
			return moment(dateData).format('DD/MM/YYYY');
		} else {
			return 'Chưa xác định';
		}
	};

	return (
		<div className='book-info'>
			<BookIntro bookInfo={bookInfo} listRatingStar={listRatingStar} />
			<ReviewRating
				className='book-info__rating'
				list={listRating}
				ratingLevel={listRatingStar?.avg}
				ratingTotal={listRatingStar?.count}
			/>
			<div className='book-info__general-information'>
				<h2>Thông tin chi tiết</h2>
				<div className='book-info__general-information__content'>
					<div className='book-info__general-information__block label-block'>
						{generalInfoLabel.map((item, index) => (
							<div key={index} className='book-info__general-information__item'>
								{item}
							</div>
						))}
					</div>
					<div className='book-info__general-information__block'>
						<div className='book-info__general-information__item'>{bookInfo?.publisher?.name}</div>
						<div className='book-info__general-information__item'>{bookInfo?.page}</div>
						<div className='book-info__general-information__item'>
							{bookInfo?.paperSize || 'Chưa có dữ liệu'}
						</div>
						<div className='book-info__general-information__item'>{bookInfo?.isbn}</div>
						<div className='book-info__general-information__item'>
							{renderPublisherDate(bookInfo.publishDate)}
						</div>
					</div>
				</div>
			</div>
			<BookReview />
		</div>
	);
};

export default BookInfo;

BookInfo.propTypes = {
	bookInfo: PropTypes.object,
};
