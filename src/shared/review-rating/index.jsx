import ReactRating from 'shared/react-rating';
import PropTypes from 'prop-types';
import RatingLevel from 'shared/rating-level';
import classNames from 'classnames';
import './review-rating.scss';

const ReviewRating = props => {
	const { list, ratingLevel, ratingTotal, className } = props;
	return (
		<div className={classNames('review-rating', { [`${className}`]: className })}>
			<div className='review-rating__left'>
				<ReactRating readonly={true} initialRating={ratingLevel} />
				<p>{ratingLevel !== 0 ? ratingLevel?.toFixed(1) : ratingLevel?.toFixed()} sao</p>
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
	className: '',
};

ReviewRating.propTypes = {
	list: PropTypes.array,
	ratingTotal: PropTypes.number,
	ratingLevel: PropTypes.number,
	className: PropTypes.string,
};

export default ReviewRating;
