import Button from 'shared/button';
import PropTypes from 'prop-types';
import './friends.scss';
import { Subtract } from 'components/svg';
import defaultAvatar from 'assets/images/avatar.jpeg';
import {
	makeFriendRequest,
	addFollower,
	unFollower,
	ReplyFriendRequest,
	unFriendRequest,
} from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { changeToggleFollows } from 'reducers/redux-utils/friends';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';
import { Link } from 'react-router-dom';

const FriendsItem = ({ list, keyTabs, getListFollower, getMyListFriendReq }) => {
	const dispatch = useDispatch();
	const suggestions = location.pathname === '/friends/suggestions';
	const invitation = location.pathname === '/friends/invitation';
	const following = location.pathname === '/friends/following';
	const follower = location.pathname === '/friends/follower';
	const [unFriend, setUnFriend] = useState(true);
	const [toggleUnFollow, setToggleUnFollow] = useState(true);
	const [toggleAddFollow, setToggleAddFollow] = useState(true);
	const [toggleAddFriend, setToggleAddFriend] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [toggleAcceptButton, setToggleAcceptButton] = useState(true);
	const [toggleModalUnFriends, setModalUnfriends] = useState(false);

	const handleModalUnFriend = () => {
		setModalUnfriends(true);
	};

	const handleUnfriend = () => {
		setModalUnfriends(false);
		try {
			if (getListFollower) {
				dispatch(unFriendRequest(list.userOne.id)).unwrap();
				dispatch(changeToggleFollows(list.userTwo.id));
			} else {
				dispatch(unFriendRequest(list.userTwo.id)).unwrap();
				dispatch(changeToggleFollows(list.userTwo.id));
			}
			setUnFriend(false);
			setToggleAddFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnFollow = () => {
		try {
			if (getListFollower) {
				dispatch(unFollower(list.userOne.id)).unwrap();
				dispatch(changeToggleFollows(list.userOne.id));
			} else {
				dispatch(unFollower(list.userTwo.id)).unwrap();
				dispatch(changeToggleFollows(list.userTwo.id));
			}
			setToggleAddFollow(true);
			setToggleUnFollow(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddFollow = () => {
		try {
			if (getListFollower) {
				const param = {
					data: { userId: list.userOne.id },
				};
				dispatch(addFollower(param)).unwrap();
				dispatch(changeToggleFollows(list.userOne.id));
			} else {
				const param = {
					data: { userId: list.userTwo.id },
				};
				dispatch(addFollower(param)).unwrap();
				dispatch(changeToggleFollows(list.userTwo.id));
			}
			setToggleAddFollow(false);
			setToggleUnFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddFriends = () => {
		try {
			if (getListFollower) {
				const param = {
					userId: list.userOne.id,
				};
				dispatch(makeFriendRequest(param)).unwrap();
				dispatch(changeToggleFollows(list.userTwo.id));
			} else {
				const param = {
					userId: list.userTwo.id,
				};
				dispatch(makeFriendRequest(param)).unwrap();
				dispatch(changeToggleFollows(list.userTwo.id));
			}
			setTogglePendingFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleReplyFriendReq = () => {
		const params = { id: list.id, data: { reply: true } };
		try {
			setToggleAcceptButton(false);
			dispatch(ReplyFriendRequest(params)).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};

	const buttonUnFriend = () => {
		return (
			<Button onClick={handleModalUnFriend} className='myfriends__button' isOutline={false} name='friend'>
				<span className='myfriends__button__content'>Hủy kết bạn</span>
			</Button>
		);
	};

	const buttonAddFriend = () => {
		return (
			<Button onClick={handleAddFriends} className='myfriends__button' isOutline={false} name='friend'>
				<span className='myfriends__button__content'>Kết bạn</span>
			</Button>
		);
	};

	const buttonPending = () => {
		return (
			<Button className='myfriends__button' isOutline={false} name='friend'>
				<span className='myfriends__button__content'> Đã gửi lời mời</span>
			</Button>
		);
	};

	const buttonFollow = () => {
		return (
			<Button onClick={handleAddFollow} className='myfriends__button' isOutline={true} name='friend'>
				<span className='myfriends__button__content'>Theo dõi</span>
			</Button>
		);
	};

	const buttonUnfollow = () => {
		return (
			<Button onClick={handleUnFollow} className='myfriends__button' isOutline={true} name='friend'>
				<span className='myfriends__button__content'>Hủy theo dõi</span>
			</Button>
		);
	};

	const buttonAcceptfriend = () => {
		return (
			<Button onClick={handleReplyFriendReq} className='myfriends__button' isOutline={false} name='friend'>
				<span className='myfriends__button__content'>
					{toggleAcceptButton ? 'Xác nhận' : 'Đã chấp nhận lời mời'}
				</span>
			</Button>
		);
	};

	const renderButtonFriends = () => {
		if (keyTabs === 'friend') {
			return buttonUnFriend();
		} else if (keyTabs === 'follow' || following || follower) {
			if (list.relation === 'friend') {
				return toggleAddFriend ? buttonUnFriend() : togglePendingFriend ? buttonAddFriend() : buttonPending();
			} else if (list.relation === 'unknown') {
				return togglePendingFriend ? buttonAddFriend() : buttonPending();
			} else {
				return buttonPending();
			}
		} else if (keyTabs === 'addfriend' || invitation) {
			return buttonAcceptfriend();
		} else {
			return buttonAddFriend();
		}
	};

	const renderButtonFollow = () => {
		if (keyTabs === 'friend') {
			if (list.isFollow) {
				return toggleUnFollow ? buttonUnfollow() : buttonFollow();
			} else {
				return toggleAddFollow ? buttonFollow() : buttonUnfollow();
			}
		} else if (keyTabs === 'follow' || following || follower) {
			if (list.isFollow) {
				return toggleUnFollow ? buttonUnfollow() : buttonFollow();
			} else {
				if ((toggleAddFollow && getListFollower) || follower) {
					return toggleAddFollow ? buttonFollow() : buttonUnfollow();
				} else {
					return toggleAddFollow ? buttonUnfollow() : buttonFollow();
				}
			}
		} else if (keyTabs === 'addfriend' || invitation) {
			return toggleAddFollow ? buttonFollow() : buttonUnfollow();
		} else {
			return buttonFollow();
		}
	};

	const renderDisplay = () => {
		return (
			<div className='myfriends__layout'>
				<Link to={`/profile/${list.userTwo.id}`}>
					<img
						className='myfriends__layout__img'
						src={list.userTwo.avatarImage ? list.userTwo.avatarImage : defaultAvatar}
						alt=''
					/>
					<div className='myfriends__star'>
						<div className='myfriends__star__name'>
							{' '}
							{list.userTwo.fullName ? (
								list.userTwo.fullName
							) : (
								<>
									<span>{list.userTwo.firstName}</span>&nbsp;
									<span>{list.userTwo.lastName}</span>
								</>
							)}
						</div>
						{list.isStar && <Subtract />}
					</div>
				</Link>

				<div className='myfriends__button__container'>
					{renderButtonFriends()}
					{renderButtonFollow()}
				</div>
			</div>
		);
	};

	const renderFollowerDisplay = () => {
		return (
			<div className='myfriends__layout'>
				<Link to={`/profile/${list.userOne.id}`}>
					<img
						className='myfriends__layout__img'
						src={list.userOne.avatarImage ? defaultAvatar : defaultAvatar}
						alt=''
					/>
					<div className='myfriends__star'>
						<div className='myfriends__star__name'>
							{list.userOne.fullName ? (
								list.userOne.fullName
							) : (
								<>
									<span>{list.userOne.firstName}</span>&nbsp;
									<span>{list.userOne.lastName}</span>
								</>
							)}
						</div>
						{list.isStar && <Subtract />}
					</div>
				</Link>
				<div className='myfriends__button__container'>
					{renderButtonFriends()}
					{renderButtonFollow()}
				</div>
			</div>
		);
	};

	const handleRenderDisplay = () => {
		if (keyTabs === 'friend') {
			return unFriend && renderDisplay();
		} else if (keyTabs === 'follow' || following || follower) {
			if (getListFollower || follower) {
				return renderFollowerDisplay();
			}
			return toggleUnFollow && renderDisplay();
		} else if (keyTabs === 'addfriend' || invitation) {
			if (getMyListFriendReq) {
				return renderFollowerDisplay();
			}
			return renderDisplay();
		} else {
			return renderDisplay();
		}
	};

	return (
		<>
			{toggleModalUnFriends && (
				<ModalUnFriend
					setModalUnfriends={setModalUnfriends}
					toggleModalUnFriends={toggleModalUnFriends}
					handleUnfriend={handleUnfriend}
					list={list}
					getListFollower={getListFollower}
				/>
			)}
			{handleRenderDisplay()}
		</>
	);
};

FriendsItem.propTypes = {
	list: PropTypes.object,
	keyTabs: PropTypes.string,
	getListFollower: PropTypes.array,
	getMyListFriendReq: PropTypes.array,
};
export default FriendsItem;
