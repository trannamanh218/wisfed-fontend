import React from 'react';
import ConnectButtons from 'shared/connect-buttons';
import UserAvatar from 'shared/user-avatar';
import './author-card.scss';
import PropTypes from 'prop-types';
import Storage from 'helpers/Storage';
import Button from 'shared/button';
import { Add } from 'components/svg';
import { useNavigate } from 'react-router-dom';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';

const AuthorCard = ({ direction, size, item, setModalShow, checkAuthors }) => {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	return (
		<div className='author-card'>
			<div className='author-card__left' onClick={() => navigate(`/profile/${item.id}`)}>
				<UserAvatar className='author-card__avatar' size={size} source={item.avatarImage || ''} />
				<div className='author-card__info'>
					<h5>{item.fullName || `${item.firstName} ${item.lastName}`}</h5>
					<p className='author-card__subtitle'>
						{item.numberFollowing || item.countFollow || item.userCounting.follower} người theo dõi,{' '}
						{item.numFriends || item.countFriend || item.userCounting.friend} bạn bè
					</p>
					{checkAuthors && (
						<>
							<p>Tác giả của cuốn sách {item.bookAuthor[0]?.name}</p>
							<span>và {item.countBook} cuốn sách khác</span>
						</>
					)}
				</div>
			</div>
			{item.relation === 'isMe' ? (
				<div className={`connect-buttons ${'column'}`}>
					<Button className='connect-button' onClick={() => navigate(`/profile/${item.id}`)}>
						<span className='connect-button__content' style={{ fontSize: 'smaller' }}>
							Xem trang cá nhân
						</span>
					</Button>
				</div>
			) : (
				<div className='author-card__right'>
					{Storage.getAccessToken() ? (
						<ConnectButtons direction={direction} item={item} />
					) : (
						<div className={`connect-buttons ${'column'}`}>
							<Button
								className='connect-button'
								onClick={() => {
									if (!Storage.getAccessToken()) {
										dispatch(checkUserLogin(true));
									} else {
										setModalShow(true);
									}
								}}
							>
								<Add className='connect-button__icon' />

								<span className='connect-button__content'>Kết bạn</span>
							</Button>
							<Button
								className=' connect-button follow'
								isOutline={true}
								name='friend'
								onClick={() => {
									if (!Storage.getAccessToken()) {
										dispatch(checkUserLogin(true));
									} else {
										setModalShow(true);
									}
								}}
							>
								<span className='connect-button__content follow'>Theo dõi </span>
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

AuthorCard.propTypes = {
	direction: PropTypes.string,
	size: PropTypes.string,
	item: PropTypes.object,
	setModalShow: PropTypes.func,
	checkAuthors: PropTypes.bool,
};

export default React.memo(AuthorCard);
