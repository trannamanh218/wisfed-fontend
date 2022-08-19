import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './share-target.scss';
import LinearProgressBar from 'shared/linear-progress-bar';
import UserAvatar from 'shared/user-avatar';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { IconRanks } from 'components/svg';

function ShareTarget({ postData, inPost = false }) {
	const [percent, setPercent] = useState(0);

	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {
		if (inPost && !_.isEmpty(postData)) {
			const percentTemp = ((postData.currentRead / postData.totalTarget) * 100).toFixed();
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
					Bạn đã đọc được {inPost ? postData.currentRead : postData?.booksReadCount} trên{' '}
					{inPost ? postData.totalTarget : postData?.numberBook} cuốn
				</p>
			</div>
		);
	};

	return (
		<div className='share-target'>
			<UserAvatar
				className='share-target__user'
				source={postData?.createdBy?.avatarImage || userInfo?.avatarImage}
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
