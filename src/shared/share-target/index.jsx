import { IconRanks } from 'components/svg';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LinearProgressBar from 'shared/linear-progress-bar';
import UserAvatar from 'shared/user-avatar';
import './share-target.scss';

function ShareTarget({ postData, inPost = false }) {
	const [percent, setPercent] = useState(0);

	useEffect(() => {
		if (inPost) {
			const percentTemp = ((postData?.sharePost.current / postData?.sharePost.target) * 100).toFixed();
			if (percentTemp > 100) {
				setPercent(100);
			} else {
				setPercent(percentTemp);
			}
		} else {
			const percentTemp = (
				(postData?.sharePost?.metaData?.currentRead / postData?.sharePost?.metaData?.totalTarget) *
				100
			).toFixed();
			if (percentTemp > 100) {
				setPercent(100);
			} else {
				setPercent(percentTemp);
			}
		}
	}, []);

	const userInfo = useSelector(state => state.auth.userInfo);

	const navigate = useNavigate();

	const renderName = () => {
		if (inPost) {
			if (
				userInfo.id === postData?.sharePost?.createdBy?.id ||
				userInfo.id === postData?.metaData?.readingGoalBy?.id
			) {
				return (
					<span
						className='share-target__content-user'
						onClick={() =>
							navigate(`/profile/${postData?.readingGoalBy?.id || postData?.metaData?.readingGoalBy?.id}`)
						}
					>
						Bạn
					</span>
				);
			} else {
				return (
					<span
						className='share-target__content-user'
						onClick={() =>
							navigate(`/profile/${postData?.readingGoalBy?.id || postData?.metaData?.readingGoalBy?.id}`)
						}
					>
						{postData?.readingGoalBy?.fullName || postData?.metaData?.readingGoalBy?.fullName}
					</span>
				);
			}
		} else {
			if (userInfo.id === postData?.sharePost?.createdBy?.id || userInfo.id === postData.userId) {
				return <span className='share-target__content-user'>Bạn</span>;
			} else {
				return (
					<span
						className='share-target__content-user'
						onClick={() => navigate(`/profile/${postData.sharePost.metaData.readingGoalBy?.id}`)}
					>
						{postData?.sharePost?.createdBy.fullName || postData.sharePost.metaData.readingGoalBy.fullName}
					</span>
				);
			}
		}
	};

	const renderContentTop = () => {
		let current;
		let total;
		if (inPost) {
			current = postData.currentRead || postData.sharePost?.current;
			total = postData.totalTarget || postData.sharePost?.target;
		} else {
			current = postData.booksReadCount || postData.sharePost?.metaData.currentRead;
			total = postData.numberBook || postData.sharePost?.metaData.totalTarget;
		}
		return (
			<div className='share-target__content__top'>
				<p>
					{renderName()} đã đọc được {current || 0} trên {total || 1} cuốn
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
						? postData?.readingGoalBy?.avatarImage || postData?.metaData?.readingGoalBy?.avatarImage
						: postData.avatarImage || postData.sharePost.createdBy.avatarImage
				}
				size='lg'
			/>
			<div className='share-target__progress'>
				{renderContentTop()}
				<LinearProgressBar
					percent={inPost ? percent : postData.percent || percent}
					variant='share-target-gradient'
				/>
				<div className='share-target__progress__percent-number'>{`${
					inPost ? percent : postData.percent || percent
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
