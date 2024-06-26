import React from 'react';
import LinearProgressBar from 'shared/linear-progress-bar';
import { Star } from 'components/svg';
import PropTypes from 'prop-types';
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
			<LinearProgressBar height={0.42} percent={percent !== 0 ? percent : 0.5} />
			<span className='rating-percent'>{`${percent.toFixed()}% (${formatNumberToWord(total)})`}</span>
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
	data: PropTypes.shape({
		level: PropTypes.number,
		percent: PropTypes.number,
		total: PropTypes.number,
	}),
};

export default RatingLevel;
