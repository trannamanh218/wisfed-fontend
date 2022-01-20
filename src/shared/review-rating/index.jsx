import React from 'react';
import ReactRating from 'shared/react-rating';
import PropsTypes from 'prop-types';
import RatingLevel from 'shared/rating-level';
import './review-rating.scss';

const ReviewRating = props => {
	const { list } = props;
	return (
		<div className='review-rating'>
			<div className='review-rating__left'>
				<ReactRating readonly={true} initialRating={4.2} />
				<p>4.2 sao</p>
				<p>4000 đánh giá</p>
			</div>
			<div className='review-rating__right'>
				{list.length && list.map((item, index) => <RatingLevel key={index} data={item} />)}
			</div>
		</div>
	);
};

ReviewRating.defaultProps = {
	list: [],
};

ReviewRating.propTypes = {
	list: PropsTypes.array,
};

export default ReviewRating;
