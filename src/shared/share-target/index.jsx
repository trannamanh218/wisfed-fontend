import { IconRanks } from 'components/svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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

	const renderContentTop = () => {
		return (
			<div className='share-target__content__top'>
				<p>
					Bạn đã đọc được{' '}
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
				source={postData?.createdBy?.avatarImage || postData?.user?.avatarImage}
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
