import './share-users.scss';
import UserAvatar from 'shared/user-avatar';
import { Crown } from 'components/svg';
import PropTypes from 'prop-types';
import { CrowSmall } from 'components/svg';

const ShareUsers = ({ postData }) => {
	const handleRenderTitle = () => {
		switch (postData?.userType || postData.originId?.userType) {
			case 'topRead':
				return 'Đọc nhiều nhất';
			case 'topReview':
				return 'Review nhiều nhất';
			case 'topLike':
				return 'Like nhiều nhất';
			case 'topFollow':
				return 'Follow nhiều nhất';
		}
	};

	const handleRenderTime = () => {
		switch (postData?.by || postData.originId?.by) {
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
						source={postData?.avatarImage || postData.info?.avatarImage}
					/>
				</div>
			</div>
			<div className='share__users__ranks__title'>{postData?.fullName || postData.info?.fullName}</div>
			<div className='title__ranks'>
				<CrowSmall />
				<div className='share__users__ranks__title__rank'>
					Top {postData?.rank || postData.originId?.rank} {handleRenderTitle()}{' '}
					{(postData?.categoryName || postData.info?.category) &&
						`Thuộc ${postData?.categoryName || postData.info.category?.name}`}{' '}
					theo {handleRenderTime()}
				</div>
			</div>
		</div>
	);
};

ShareUsers.propTypes = {
	postData: PropTypes.object,
};

export default ShareUsers;
