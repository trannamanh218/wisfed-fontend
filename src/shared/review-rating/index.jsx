import React from 'react';
import ReactRating from 'shared/react-rating';
import PropsTypes from 'prop-types';
import RatingLevel from 'shared/rating-level';
import './review-rating.scss';

const ReviewRating = props => {
	const { list, ratingLevel, ratingTotal } = props;
	return (
		<div className='review-rating'>
			<div className='review-rating__left'>
				<ReactRating readonly={true} initialRating={4.2} />
				<p>{ratingLevel} sao</p>
				<p>{ratingTotal} đánh giá</p>
			</div>
			<div className='review-rating__right'>
				{list.length && list.map((item, index) => <RatingLevel key={index} data={item} />)}
			</div>
		</div>
	);
};

ReviewRating.defaultProps = {
	list: [],
	ratingTotal: 0,
	ratingLevel: 0,
};

ReviewRating.propTypes = {
	list: PropsTypes.array,
	ratingTotal: PropsTypes.number,
	ratingLevel: PropsTypes.number,
};

export default ReviewRating;
