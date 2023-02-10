import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';
import { Subtract } from 'components/svg';
import { NotificationError } from 'helpers/Error';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	addFollower,
	makeFriendRequest,
	replyFriendRequest,
	unFollower,
	unFriendRequest,
} from 'reducers/redux-utils/user';
import Button from 'shared/button';
import './friends.scss';

const FriendsItem = ({ data, keyTabs }) => {
	const dispatch = useDispatch();
	const invitation = location.pathname === '/friends/invitation';
	const following = location.pathname === '/friends/following';
	const follower = location.pathname === '/friends/follower';
	const suggestions = location.pathname === '/friends/suggestions';
	const recommend = location.pathname === '/friends/recommend';

	const [toggleAddFriend, setToggleAddFriend] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [toggleAcceptButton, setToggleAcceptButton] = useState(true);
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);
	const [isFollow, setIsFollow] = useState(false);

	const [dataUser, setDataUser] = useState({});

	const { userInfo } = useSelector(state => state.auth);

	useEffect(() => {
		if (data.userOne) {
			if (data.userOne.id !== userInfo.id) {
				setDataUser(data.userOne);
			} else {
				setDataUser(data.userTwo);
			}
		} else {
			setDataUser(data);
		}

		data.isFollow ? setIsFollow(true) : setIsFollow(false);
	}, []);

	const handleModalUnFriend = () => {
		setShowModalUnfriends(true);
	};

	const handleUnfriend = async () => {
		setShowModalUnfriends(false);
		try {
			await dispatch(unFriendRequest(dataUser.id)).unwrap();
			setToggleAddFriend(false);
			setIsFollow(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnFollow = async () => {
		try {
			await dispatch(unFollower(dataUser.id)).unwrap();
			setIsFollow(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddFollow = async () => {
		try {
			await dispatch(addFollower({ userId: dataUser.id })).unwrap();
			setIsFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddFriends = async () => {
		try {
			await dispatch(makeFriendRequest({ userId: dataUser.id })).unwrap();
			setTogglePendingFriend(false);
			setIsFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleReplyFriendReq = () => {
		const params = { id: data.friendRequest?.id || data.id, data: { reply: true } };
		try {
			setToggleAcceptButton(false);
			dispatch(replyFriendRequest(params)).unwrap();
			setIsFollow(true);
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
				<span className='myfriends__button__content'>Đã gửi lời mời</span>
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
			if (data.relation === 'friend') {
				return toggleAddFriend ? buttonUnFriend() : togglePendingFriend ? buttonAddFriend() : buttonPending();
			} else if (data.relation === 'unknown') {
				return togglePendingFriend ? buttonAddFriend() : buttonPending();
			} else {
				return buttonPending();
			}
		} else if (keyTabs === 'suggest' || suggestions || recommend) {
			if (data.relation === 'unknown' || data.relation === undefined) {
				return togglePendingFriend ? buttonAddFriend() : buttonPending();
			} else if (data.friendRequest.type === 'requestToMe') {
				return buttonAcceptfriend();
			} else {
				return buttonPending();
			}
		} else if (keyTabs === 'addfriend' || invitation) {
			return buttonAcceptfriend();
		} else {
			return buttonAddFriend();
		}
	};

	return (
		<>
			<ModalUnFriend
				showModalUnfriends={showModalUnfriends}
				toggleModal={() => setShowModalUnfriends(!showModalUnfriends)}
				handleUnfriend={handleUnfriend}
				data={dataUser}
			/>
			<div className='myfriends__layout'>
				<Link to={`/profile/${dataUser.id}`}>
					<img
						className='myfriends__layout__img'
						src={dataUser.avatarImage || defaultAvatar}
						alt='image'
						onError={e => e.target.setAttribute('src', `${defaultAvatar}`)}
					/>

					<div className='myfriends__star'>
						<div
							className='myfriends__star__name'
							title={dataUser.fullName || dataUser.firstName + ' ' + dataUser.lastName}
						>
							{dataUser.fullName || dataUser.firstName + ' ' + dataUser.lastName}
						</div>
						{data.isStar && <Subtract />}
					</div>
					{keyTabs === 'friend' && data.mutualFriend > 0 && (
						<div className='myFriend__mutualFriend'>({data.mutualFriend} bạn chung)</div>
					)}
				</Link>

				<div className='myfriends__button__container'>
					{renderButtonFriends()}
					<Button
						onClick={isFollow ? handleUnFollow : handleAddFollow}
						className='myfriends__button'
						isOutline
						name='friend'
					>
						<span className='myfriends__button__content'>{isFollow ? 'Bỏ theo dõi' : 'Theo dõi'}</span>
					</Button>
				</div>
			</div>
		</>
	);
};

FriendsItem.propTypes = {
	data: PropTypes.object,
	keyTabs: PropTypes.string,
};
export default FriendsItem;
