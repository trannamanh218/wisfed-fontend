import { Add } from 'components/svg';
import { useState } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';

const ConnectButtonsFollower = ({ direction, item, isFollower }) => {
	const dispatch = useDispatch();
	const [unFriend, setUnFriend] = useState(true);
	const [toggleUnFollow, setToggleUnFollow] = useState(true);
	const [toggleAddFollow, setToggleAddFollow] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);

	const buttonUnFollow = () => {
		return (
			<Button className='connect-button follow' name='friend' onClick={handleUnFollow}>
				<span className='connect-button__content follow'>Bỏ theo dõi </span>
			</Button>
		);
	};

	const buttonAddFollow = () => {
		return (
			<Button className=' connect-button follow' name='friend' onClick={handleFollow}>
				<span className='connect-button__content follow'>Theo dõi </span>
			</Button>
		);
	};

	const buttonAddFriend = () => {
		return (
			<Button className='connect-button' isOutline={true} onClick={handleAddFriend}>
				<Add className='connect-button__icon' />

				<span className='connect-button__content'>Kết bạn</span>
			</Button>
		);
	};

	const handleModalUnFriend = () => {
		setShowModalUnfriends(true);
	};

	const buttonUnFriend = () => {
		return (
			<Button className='connect-button' isOutline={true} onClick={handleModalUnFriend}>
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
		if (isFollower) {
			try {
				const param = {
					userId: item.userIdOne,
				};
				dispatch(makeFriendRequest(param)).unwrap();
				setTogglePendingFriend(false);
			} catch (err) {
				NotificationError(err);
			}
		} else {
			try {
				const param = {
					userId: item.userIdTwo,
				};
				dispatch(makeFriendRequest(param)).unwrap();
				setTogglePendingFriend(false);
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	const handleUnfriend = () => {
		setShowModalUnfriends(false);
		if (isFollower) {
			try {
				dispatch(unFriendRequest(item.userIdOne)).unwrap();
				setUnFriend(false);
			} catch (err) {
				NotificationError(err);
			}
		} else {
			try {
				dispatch(unFriendRequest(item.userIdTwo)).unwrap();
				setUnFriend(false);
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	const handleFollow = () => {
		if (isFollower) {
			try {
				dispatch(addFollower({ userId: item.userIdOne }));
				setToggleAddFollow(false);
				setToggleUnFollow(true);
			} catch (err) {
				NotificationError(err);
			}
		} else {
			try {
				dispatch(addFollower({ userId: item.userIdTwo }));
				setToggleAddFollow(false);
				setToggleUnFollow(true);
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	const handleUnFollow = () => {
		if (isFollower) {
			try {
				dispatch(unFollower(item.userIdOne)).unwrap();
				setToggleAddFollow(true);
				setToggleUnFollow(false);
			} catch (err) {
				NotificationError(err);
			}
		} else {
			try {
				dispatch(unFollower(item.userIdTwo)).unwrap();
				setToggleAddFollow(true);
				setToggleUnFollow(false);
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	const handleRenderButtonFollow = () => {
		if (item.isFollow) {
			return toggleUnFollow ? buttonUnFollow() : buttonAddFollow();
		} else {
			return toggleAddFollow ? buttonAddFollow() : buttonUnFollow();
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

	const toggleModal = () => {
		setShowModalUnfriends(!showModalUnfriends);
	};

	return (
		<div className={`connect-buttons ${direction}`}>
			{item.relation !== 'isMe' && (
				<>
					{' '}
					{handleRenderButtonFollow()}
					{handleRenderButtonFriend()}
					<ModalUnFriend
						showModalUnfriends={showModalUnfriends}
						toggleModal={toggleModal}
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
