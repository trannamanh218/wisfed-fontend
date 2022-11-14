import './loading-timeline.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LoadingTimeLine = ({ numberItems, isTwoLines }) => {
	return (
		<div className='timeline-wrapper'>
			{numberItems &&
				[...Array(numberItems)].map((_, index) => (
					<div key={index} className='timeline-item'>
						<div className='animated-background avatar'></div>
						<div className='content__container'>
							<div className={classNames('animated-background content', { 'thin': isTwoLines })}></div>
							{isTwoLines && <div className='animated-background content thin short'></div>}
						</div>
					</div>
				))}
		</div>
	);
};

LoadingTimeLine.defaultProps = {
	numberItems: 1,
	isTwoLines: true,
};

LoadingTimeLine.propTypes = {
	numberItems: PropTypes.number,
	isTwoLines: PropTypes.bool,
};

export default LoadingTimeLine;
