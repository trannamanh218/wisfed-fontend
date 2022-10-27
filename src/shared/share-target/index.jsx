import { IconRanks } from 'components/svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LinearProgressBar from 'shared/linear-progress-bar';
import UserAvatar from 'shared/user-avatar';
import './share-target.scss';

function ShareTarget({ postData, inPost = false }) {
	const [percent, setPercent] = useState(0);

	useEffect(() => {
		if (inPost && !_.isEmpty(postData)) {
			const percentTemp = ((postData?.sharePost.current / postData?.sharePost.target) * 100).toFixed();
			if (percentTemp > 100) {
				setPercent(100);
			} else {
				setPercent(percentTemp);
			}
		}
	}, []);

	const userInfo = useSelector(state => state.auth.userInfo);

	const renderName = () => {
		if (inPost) {
			if (
				userInfo.id === postData?.readingGoalBy?.dataValues?.id ||
				userInfo.id === postData?.metaData?.readingGoalBy?.id
			) {
				return 'Bạn';
			} else {
				return postData?.readingGoalBy?.dataValues?.fullName || postData?.metaData?.readingGoalBy?.fullName;
			}
		} else {
			if (userInfo.id === postData?.userId) {
				return 'Bạn';
			} else {
				return postData.fullName;
			}
		}
	};

	const renderContentTop = () => {
		return (
			<div className='share-target__content__top'>
				<p>
					{renderName()} đã đọc được{' '}
					{inPost ? postData.currentRead || postData?.sharePost.current : postData?.booksReadCount} trên{' '}
					{inPost ? postData.totalTarget || postData?.sharePost.target : postData?.numberBook} cuốn
				</p>
			</div>
		);
	};

	return (
		<div className='share-target'>
			<UserAvatar
				className='share-target__user'
				source={
					inPost
						? postData?.readingGoalBy?.dataValues?.avatarImage ||
						  postData?.metaData?.readingGoalBy?.avatarImage
						: postData.avatarImage
				}
				size='lg'
			/>
			<div className='share-target__progress'>
				{renderContentTop()}
				<LinearProgressBar percent={inPost ? percent : postData?.percent} variant='share-target-gradient' />
				<div className='share-target__progress__percent-number'>{`${
					inPost ? percent : postData.percent
				}%`}</div>
			</div>
			<IconRanks />
		</div>
	);
}

ShareTarget.propTypes = {
	postData: PropTypes.object,
	inPost: PropTypes.bool,
};

export default ShareTarget;
