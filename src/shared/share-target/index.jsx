import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LinearProgressBar from 'shared/linear-progress-bar';
import UserAvatar from 'shared/user-avatar';
import './index.scss';
import _ from 'lodash';
import PropTypes from 'prop-types';

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
			<div className='reading-target__content__top'>
				<p>
					Bạn đã đọc được {inPost ? postData.currentRead : postData?.booksReadCount} trên{' '}
					{inPost ? postData.totalTarget : postData?.numberBook} cuốn
				</p>
			</div>
		);
	};

	return (
		<div className='reading-target__process'>
			<UserAvatar className='reading-target__user' source={userInfo?.avatarImage} size='lg' />
			<div className='reading-target__content'>
				{renderContentTop()}
				<div className='reading-target__content__bottom'>
					<LinearProgressBar
						percent={inPost ? percent : postData?.percent}
						label={`${inPost ? percent : postData?.percent} %`}
					/>
				</div>
			</div>
		</div>
	);
}

ShareTarget.propTypes = {
	postData: PropTypes.object,
	inPost: PropTypes.bool,
};

export default ShareTarget;
