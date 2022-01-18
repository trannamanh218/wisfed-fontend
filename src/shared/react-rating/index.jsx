import React from 'react';
import Rating from 'react-rating';
import { Star } from 'components/svg';
import PropsTypes from 'prop-types';
import './react-rating.scss';

const ReactRating = ({ initialRating, stop = 5, handleChange, readonly, fractions }) => {
	return (
		<Rating
			className='react-rating-container'
			initialRating={initialRating}
			stop={stop}
			fractions={fractions}
			onChange={handleChange}
			emptySymbol={<Star className='star-icon' />}
			fullSymbol={<Star className='star-icon fill' />}
			readonly={readonly}
		/>
	);
};

ReactRating.propTypes = {
	initialRating: PropsTypes.number,
	stop: PropsTypes.number,
	fractions: PropsTypes.number,
	handleChange: PropsTypes.func,
	readonly: PropsTypes.bool,
};

export default ReactRating;
