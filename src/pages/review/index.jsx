// import { useFetchInfiniateActivities } from 'api/activity.hooks';
import NormalContainer from 'components/layout/normal-container';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BackButton from 'shared/back-button';
import FilterPane from 'shared/filter-pane';
import PostList from 'shared/post-list';
import ReviewBookInfo from './review-book-info';
import './review.scss';

const Review = () => {
	const listReview = Array.from(Array(5)).fill({
		id: 1,
		userAvatar: '/images/avatar.png',
		userName: 'Trần Văn Đức',
		bookImage: '',
		bookName: '',
		isLike: true,
		likeNumber: 15,
		commentNumber: 1,
		shareNumber: 3,
	});

	const params = useParams();
	const { userInfo } = useSelector(state => state.auth);

	const [filter, setFilter] = useState();

	useEffect(() => {
		if (!_.isEmpty(userInfo) && !_.isEmpty(params)) {
			const filterData = [
				{ 'operator': 'eq', 'value': `user:${userInfo.id}`, 'property': 'origin' },
				{
					'operator': 'search',
					'value': params.id,
					'property': 'bookId',
				},
			];
			setFilter(filterData);
		}
		window.scrollTo(0, 0);
	}, [params, userInfo]);

	return (
		<NormalContainer>
			<div className='review'>
				<div className='review__header'>
					<BackButton destination={-1} className='review__header__btn' />
					<h4>Bài Review về Đắc Nhân Tâm của Thanh Nguyễn</h4>
				</div>
				<ReviewBookInfo />
				<FilterPane title='Bài Review'>
					<PostList list={listReview} />
				</FilterPane>
			</div>
		</NormalContainer>
	);
};

Review.propTypes = {};

export default Review;
