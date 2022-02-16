import NormalContainer from 'components/layout/normal-container';
import React from 'react';
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

	return (
		<NormalContainer>
			<div className='review'>
				<div className='review__header'>
					<BackButton className='review__header__btn' />
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
