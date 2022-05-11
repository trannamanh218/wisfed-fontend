import PropTypes from 'prop-types';
import { StarRanks } from 'components/svg/index';

const StarRanking = ({ index }) => {
	return (
		<div className='topbooks__container__main__svg'>
			{index < 3 ? (
				<StarRanks className={`topbooks__container__star star-${index}`} />
			) : (
				<div className='topbooks__container__star__ranks'></div>
			)}
			<div
				className={
					index < 3
						? `topbooks__container__number___ranks star-${index}`
						: 'topbooks__container__number___custom'
				}
			>
				{index + 1}
			</div>
		</div>
	);
};
StarRanking.propTypes = {
	index: PropTypes.number,
};
export default StarRanking;
