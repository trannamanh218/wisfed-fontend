import './share-users.scss';
import UserAvatar from 'shared/user-avatar';
import { Crown } from 'components/svg';
import PropTypes from 'prop-types';
import { CrowSmall } from 'components/svg';
const ShareUsers = ({ postsData }) => {
	const handleRenderTitle = () => {
		switch (postsData?.userType || postsData.originId?.userType) {
			case 'topRead':
				return 'Đọc nhiều nhất';
			case 'topReview':
				return 'Review nhiều nhất';
			case 'topLike':
				return 'Like nhiều nhất';
			case 'topFollow':
				return 'Follow nhiều nhất';
			default:
				break;
		}
	};

	const handleRenderTime = () => {
		switch (postsData?.by || postsData.originId?.by) {
			case 'week':
				return 'Tuần';
			case 'month':
				return 'Tháng';
			case 'year':
				return 'Năm';
			default:
				break;
		}
	};

	return (
		<div className='share__users__container'>
			<div className='share__users__ranks__one'>
				<div className='Crown'>
					<Crown />
				</div>
				<div className='share__users__ranks__avatar'>
					<UserAvatar
						className='author-card__avatar'
						size='lg'
						source={postsData?.avatarImage || postsData.info?.avatarImage}
					/>{' '}
				</div>
			</div>
			<div className='share__users__ranks__title'>{postsData?.fullName || postsData.info?.fullName}</div>
			<div className='title__ranks'>
				<CrowSmall />
				<div className='share__users__ranks__title__rank'>
					Top {postsData?.rank || postsData.originId?.rank} {handleRenderTitle()}{' '}
					{(postsData?.categoryName || postsData.info?.category) &&
						`Thuộc ${postsData?.categoryName || postsData.info.category?.name}`}{' '}
					theo {handleRenderTime()}
				</div>
			</div>
		</div>
	);
};
ShareUsers.propTypes = {
	postsData: PropTypes.object,
};

export default ShareUsers;
