import React, { useState } from 'react';
import Rating from 'react-rating';
import { Star } from 'components/svg';
import PropTypes from 'prop-types';
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
	initialRating: PropTypes.number,
	stop: PropTypes.number,
	fractions: PropTypes.number,
	handleChange: PropTypes.func,
	readonly: PropTypes.bool,
};

export default ReactRating;
