// import { useFetchInfiniateActivities } from 'api/activity.hooks';
import NormalContainer from 'components/layout/normal-container';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BackButton from 'shared/back-button';
import ReviewBookInfo from './review-book-info';
import './review.scss';
import { getReviewsBook } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import { getBookDetail } from 'reducers/redux-utils/book';
import { getUserDetail } from 'reducers/redux-utils/user';
import Post from 'shared/post';
import { REVIEW_TYPE } from 'constants/index';
import { updateReviewIdFromNoti } from 'reducers/redux-utils/notification';

const Review = () => {
	const { bookId, userId } = useParams();
	const [listReview, setListReview] = useState([]);
	const [bookInfo, setBookInfo] = useState({});
	const [title, setTitle] = useState('');
	const [filter, setFilter] = useState([]);

	const bookInfoRedux = useSelector(state => state.book.bookInfo);
	const titleReviewPage = useSelector(state => state.common.titleReviewPage);
	const reviewIdFromNotification = useSelector(state => state.notificationReducer.reviewIdFromNotification);

	const dispatch = useDispatch();

	useEffect(async () => {
		window.scrollTo(0, 0);
		if (!_.isEmpty(bookInfoRedux) && titleReviewPage) {
			setBookInfo(bookInfoRedux);
			setTitle(titleReviewPage);
		} else {
			const bookName = await getBookData();
			if (bookName) {
				getUserData(bookName);
			}
		}
		if (reviewIdFromNotification) {
			setFilter([{ 'operator': 'eq', 'value': reviewIdFromNotification, 'property': 'id' }]);
		} else {
			setFilter([{ operator: 'eq', value: userId, property: 'createdBy' }]);
		}
	}, [bookId]);

	useEffect(() => {
		if (filter.length) {
			getReviewList();
			dispatch(updateReviewIdFromNoti(null));
		}
	}, [filter]);

	const getReviewList = async () => {
		try {
			const params = {
				start: 0,
				limit: 10,
				sort: JSON.stringify([{ direction: 'DESC', property: 'createdAt' }]),
				filter: JSON.stringify(filter),
			};
			const response = await dispatch(getReviewsBook({ bookId, params })).unwrap();
			setListReview(response.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getBookData = async () => {
		try {
			const res = await dispatch(getBookDetail(bookId)).unwrap();
			setBookInfo(res);
			return res.name;
		} catch (err) {
			NotificationError(err);
		}
	};

	const getUserData = async bookName => {
		try {
			const res = await dispatch(getUserDetail(userId)).unwrap();
			setTitle(`Bài Review về ${bookName} của ${res.fullName}`);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<>
			{!_.isEmpty(bookInfo) && (
				<NormalContainer>
					<div className='review'>
						<div className='review__header'>
							<div>
								<BackButton destination={-1} className='review__header__btn' />
							</div>
							<h4>{title}</h4>
						</div>
						<ReviewBookInfo bookInfo={bookInfo} />
						<div className='review__items'>
							<h4>Bài Review</h4>
							{listReview?.length > 0 ? (
								listReview.map((item, index) => (
									<div clas key={item.id}>
										<Post postInformations={item} type={REVIEW_TYPE} />
										{listReview.length > 1 && index < listReview.length - 1 && <hr />}
									</div>
								))
							) : (
								<div className='review__no-data'>Chưa có bài review nào</div>
							)}
						</div>
					</div>
				</NormalContainer>
			)}
		</>
	);
};

export default Review;
