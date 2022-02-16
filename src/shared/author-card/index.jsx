import React from 'react';
import ConnectButtons from 'shared/connect-buttons';
import UserAvatar from 'shared/user-avatar';
import './author-card.scss';

const AuthorCard = () => {
	return (
		<div className='author-card'>
			<div className='author-card__left'>
				<UserAvatar className='author-card__avatar' size='lg' />
				<div className='author-card__info'>
					<h5>Mai Nguyễn</h5>
					<p className='author-card__subtitle'>3K follow, 300 bạn bè</p>
					<p>Tác giả của cuốn sách cuốn theo chiều gió</p>
					<span>và 500 cuốn sách khác</span>
				</div>
			</div>
			<div className='author-card__right'>
				<ConnectButtons direction='column' />
			</div>
		</div>
	);
};

AuthorCard.propTypes = {};

export default AuthorCard;
