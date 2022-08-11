import React from 'react';
import { useSelector } from 'react-redux';
import './index.scss';
import LinearProgressBar from 'shared/linear-progress-bar';
import UserAvatar from 'shared/user-avatar';
import popoup from '../../assets/images/popup.png';
import medal from '../../assets/images/medal.png';

function ShareTarget({ postsData }) {
	const { userInfo } = useSelector(state => state.auth);

	const renderContentTop = () => {
		return (
			<div className='reading-target__content__top__popup'>
				<p>
					Bạn đã đọc được {postsData?.booksReadCount} trên {postsData?.numberBook} cuốn
				</p>
			</div>
		);
	};

	return (
		<div className='reading-container'>
			<img src={popoup} />
			<div className='reading-target__process__popup'>
				<UserAvatar className='reading-target__user__img' source={userInfo?.avatarImage} size='lg' />
				<div className='reading-target__content__popup'>
					{renderContentTop()}
					<div className='reading-target__content__bottom__popup'>
						<LinearProgressBar percent={postsData.percent} />
						<div className='modal-pecent'>{`${postsData.percent}%`}</div>
					</div>
				</div>
				<div>
					<img className='medal' src={medal} />
				</div>
			</div>
		</div>
	);
}

export default ShareTarget;
