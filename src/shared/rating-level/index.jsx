import React from 'react';
import LinearProgressBar from 'shared/linear-progress-bar';
import { Star } from 'components/svg';
import PropsTypes from 'prop-types';
import { formatNumberToWord } from 'helpers/Common';
import './rating-level.scss';

const RatingLevel = props => {
	const { data } = props;
	const { level, percent, total } = data;

	return (
		<div className='rating-level'>
			<span className='rating-level__number'>{level}</span>
			<span className='rating-level__icon'>
				<Star />
			</span>
			<LinearProgressBar height={0.42} percent={percent} />
			<span>{`${percent}% (${formatNumberToWord(total)})`}</span>
		</div>
	);
};

RatingLevel.defaultProps = {
	data: {
		level: 5,
		percent: 38,
		total: 22300,
	},
};

RatingLevel.propTypes = {
	data: PropsTypes.shape({
		level: PropsTypes.number,
		percent: PropsTypes.number,
		total: PropsTypes.number,
	}),
};

export default RatingLevel;
