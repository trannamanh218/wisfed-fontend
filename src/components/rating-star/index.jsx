import './styles.scss';
import { Star } from 'components/svg';
import { useState } from 'react';
import PropTypes from 'prop-types';

function RatingStar({ ratingStatus, ratingValue }) {
	const [rating, setRating] = useState(ratingValue);
	const [hover, setHover] = useState(0);
	return (
		<>
			{ratingStatus ? (
				<div className='star-rating'>
					{[...Array(5)].map((star, index) => {
						index += 1;
						return (
							<button
								key={index}
								className={index <= (hover || rating) ? 'rating-btn on' : 'rating-btn off'}
								onClick={() => setRating(index)}
								onMouseEnter={() => setHover(index)}
								onMouseLeave={() => setHover(rating)}
							>
								<Star />
							</button>
						);
					})}
				</div>
			) : (
				<div className='star-rating'>
					{[...Array(5)].map((star, index) => {
						index += 1;
						return (
							<button
								key={index}
								className={index <= (hover || rating) ? 'rating-btn on' : 'rating-btn off'}
							>
								<Star />
							</button>
						);
					})}
				</div>
			)}
		</>
	);
}
RatingStar.propTypes = {
	ratingStatus: PropTypes.bool,
	ratingValue: PropTypes.number,
};

export default RatingStar;
