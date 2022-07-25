import React from 'react';
import { useSelector } from 'react-redux';

import LinearProgressBar from 'shared/linear-progress-bar';
import UserAvatar from 'shared/user-avatar';

function ShareTarget() {
	const { userInfo } = useSelector(state => state.auth);
	const { target } = useSelector(state => state.target);

	console.log(target);
	const renderContentTop = () => {
		return (
			<div className='reading-target__content__top'>
				<p>
					Bạn đã đọc được {target?.booksReadCount} trên {target?.numberBook} cuốn
				</p>
			</div>
		);
	};

	return (
		<div>
			<div className='reading-target__process'>
				<UserAvatar className='reading-target__user' source={userInfo?.avatarImage} size='lg' />
				<div className='reading-target__content'>
					{renderContentTop()}
					<div className='reading-target__content__bottom'>
						<LinearProgressBar percent={20} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default ShareTarget;
