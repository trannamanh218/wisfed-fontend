import UserAvatar from 'shared/user-avatar';
import { Crown } from 'components/svg';
import './top-ranks.scss';
import PropTypes from 'prop-types';

const TopRanks = ({ getListTopBooks, listDataSortType }) => {
	const handleRenderTitle = () => {
		return listDataSortType.map(item => {
			if (item.value === 'topFollow') {
				return <span>Follow</span>;
			}
		});
	};
	const handleNumber = number => {
		return listDataSortType.map(item => {
			if (item.value === 'topFollow') {
				return <div className='number__books'>{getListTopBooks[number].numberFollowing}</div>;
			}
		});
	};
	return (
		<div className='top__user__ranks'>
			<div className='top__user__ranks__two'>
				<div className='top__user__ranks__two__avatar'>
					<UserAvatar className='author-card__avatar' source={getListTopBooks[1].avatarImage} />
					<div className='number__ranks'>2</div>
				</div>
				<div className='top__user__ranks__two__title'>
					<p>
						{getListTopBooks[1].fullName ||
							`${getListTopBooks[1].firstName}  ${getListTopBooks[1].lastName}`}
					</p>
					{handleNumber(1)}
					{handleRenderTitle()}
				</div>
			</div>
			<div className='top__user__ranks__one'>
				<div className='top__user__ranks__one__avatar'>
					<div className='Crown'>
						<Crown />
					</div>
					<UserAvatar className='author-card__avatar' source={getListTopBooks[0].avatarImage} />
					<div className='number__ranks'>1</div>
				</div>
				<div className='top__user__ranks__one__title'>
					<p>
						{getListTopBooks[0].fullName ||
							`${getListTopBooks[0].firstName}  ${getListTopBooks[0].lastName}`}
					</p>
					{handleNumber(0)}
					{handleRenderTitle()}
				</div>
			</div>
			<div className='top__user__ranks__two'>
				<div className='top__user__ranks__two__avatar three'>
					<UserAvatar className='author-card__avatar' source={getListTopBooks[2].avatarImage} />
					<div className='number__ranks three'>3</div>
				</div>
				<div className='top__user__ranks__two__title'>
					<p>
						{getListTopBooks[2].fullName ||
							`${getListTopBooks[2].firstName}  ${getListTopBooks[2].lastName}`}{' '}
					</p>
					{handleNumber(2)}
					{handleRenderTitle()}
				</div>
			</div>
		</div>
	);
};
TopRanks.propTypes = {
	getListTopBooks: PropTypes.array,
	listDataSortType: PropTypes.array,
};
export default TopRanks;
