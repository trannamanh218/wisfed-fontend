import Rating from 'react-rating';
import { Star, StarRanksBXH, StarRanksActive } from 'components/svg';
import PropTypes from 'prop-types';
import './react-rating.scss';

const ReactRating = ({ initialRating, stop = 5, handleChange, readonly, fractions, checkStar }) => {
	return (
		<Rating
			className='react-rating-container'
			initialRating={initialRating}
			stop={stop}
			fractions={fractions}
			onChange={handleChange}
			emptySymbol={checkStar ? <StarRanksBXH className='star-icon' /> : <Star className='star-icon' />}
			fullSymbol={
				checkStar ? <StarRanksActive className='star-icon fill' /> : <Star className='star-icon fill' />
			}
			readonly={readonly}
		/>
	);
};

ReactRating.propTypes = {
	initialRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	stop: PropTypes.number,
	fractions: PropTypes.number,
	handleChange: PropTypes.func,
	readonly: PropTypes.bool,
	checkStar: PropTypes.bool,
};

export default ReactRating;
