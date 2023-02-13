import { Add } from 'components/svg';
import { useState, useEffect } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';

const ConnectButtonsFollower = ({ direction, item, isFollower }) => {
	const dispatch = useDispatch();
	const [unFriend, setUnFriend] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);

	const [isFollow, setIsFollow] = useState(false);
	const [userId, setUserId] = useState(item.userIdOne);

	useEffect(() => {
		item.isFollow && setIsFollow(true);
		!isFollower && setUserId(item.userIdTwo);
	}, []);

	const buttonAddFriend = () => {
		return (
			<Button className='connect-button' isOutline={true} onClick={handleAddFriend}>
				<Add className='connect-button__icon' />
				<span className='connect-button__content'>Kết bạn</span>
			</Button>
		);
	};

	const buttonUnFriend = () => {
		return (
			<Button className='connect-button' isOutline={true} onClick={() => setShowModalUnfriends(true)}>
				<span className='connect-button__content'>─&nbsp;&nbsp; Hủy kết bạn</span>
			</Button>
		);
	};

	const buttonPendingFriend = () => {
		return (
			<Button className='connect-button' isOutline={true}>
				<span className='connect-button__content'>&nbsp;&nbsp; Đã gửi lời mời</span>
			</Button>
		);
	};

	const handleAddFriend = () => {
		try {
			const param = {
				userId: userId,
			};
			dispatch(makeFriendRequest(param)).unwrap();
			setTogglePendingFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnfriend = () => {
		setShowModalUnfriends(false);
		try {
			dispatch(unFriendRequest(userId)).unwrap();
			setUnFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleFollow = async () => {
		try {
			await dispatch(addFollower({ userId: userId })).unwrap();
			setIsFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnFollow = async () => {
		try {
			await dispatch(unFollower(userId)).unwrap();
			setIsFollow(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleRenderButtonFriend = () => {
		if (item.relation === 'friend') {
			return unFriend ? buttonUnFriend() : togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
		} else if (item.relation === 'pending') {
			return buttonPendingFriend();
		} else if (item.relation === 'unknown') {
			return togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
		}
	};

	return (
		<div className={`connect-buttons ${direction}`}>
			{item.relation !== 'isMe' && (
				<>
					<Button
						onClick={isFollow ? handleUnFollow : handleFollow}
						className='connect-button follow'
						name='friend'
					>
						<span className='connect-button__content follow'>{isFollow ? 'Bỏ theo dõi' : 'Theo dõi'}</span>
					</Button>
					{handleRenderButtonFriend()}
					<ModalUnFriend
						showModalUnfriends={showModalUnfriends}
						toggleModal={() => setShowModalUnfriends(!showModalUnfriends)}
						handleUnfriend={handleUnfriend}
						data={item}
					/>
				</>
			)}
		</div>
	);
};

ConnectButtonsFollower.defaultProps = {
	data: {
		isFriend: false,
		isFollow: false,
	},
	direction: 'column',
};

ConnectButtonsFollower.propTypes = {
	data: PropTypes.shape({
		isFollow: PropTypes.bool.isRequired,
		isFriend: PropTypes.bool.isRequired,
	}),
	item: PropTypes.object,
	direction: PropTypes.oneOf(['row', 'column']),
	isFollower: PropTypes.bool,
};

export default ConnectButtonsFollower;
