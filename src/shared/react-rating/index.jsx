import React from 'react';
import Rating from 'react-rating';
import { Star } from 'components/svg';
import PropsTypes from 'prop-types';
import './react-rating.scss';

const ReactRating = ({ initialRating = 0, stop = 5, handleChange, readonly = false, fractions = 1 }) => {
	if (readonly) {
		return (
			<Rating
				initialRating={initialRating}
				stop={stop}
				fractions={fractions}
				onChange={handleChange}
				emptySymbol={<Star className='star-icon' />}
				fullSymbol={<Star className='star-icon fill' />}
				readonly
			/>
		);
	}

	return (
		<Rating
			initialRating={initialRating}
			stop={stop}
			fractions={fractions}
			onChange={handleChange}
			emptySymbol={<Star className='star-icon' />}
			fullSymbol={<Star className='star-icon fill' />}
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
