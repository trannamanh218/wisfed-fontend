import { Add, Minus } from 'components/svg';
import { useState } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

const ConnectButtonsFollower = ({ direction, item }) => {
	const dispatch = useDispatch();
	const [unFriend, setUnFriend] = useState(true);
	const [toggleUnFollow, setToggleUnFollow] = useState(true);
	const [toggleAddFollow, setToggleAddFollow] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	// const [toggleModalUnFriends, setModalUnfriends] = useState(false);

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

	const buttonUnFriend = () => {
		return (
			<Button className='connect-button' isOutline={true} onClick={handleUnFriend}>
				<Minus className='connect-button__icon' />
				<span className='connect-button__content'>Huỷ kết bạn</span>
			</Button>
		);
	};

	const buttonPendingFriend = () => {
		return (
			<Button className='connect-button' isOutline={true}>
				<Minus className='connect-button__icon' />
				<span className='connect-button__content'>Đã gửi lời mời</span>
			</Button>
		);
	};

	const handleAddFriend = () => {
		try {
			const param = {
				userId: item.userIdOne,
			};
			dispatch(makeFriendRequest(param)).unwrap();
			setTogglePendingFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleUnFriend = () => {
		// setModalUnfriends(false);
		try {
			dispatch(unFriendRequest(item.userIdOne)).unwrap();
			setUnFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleFollow = () => {
		try {
			dispatch(addFollower({ userId: item.userIdOne }));
			setToggleAddFollow(false);
			setToggleUnFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleUnFollow = () => {
		try {
			dispatch(unFollower(item.userIdOne)).unwrap();
			setToggleAddFollow(true);
			setToggleUnFollow(false);
		} catch (err) {
			NotificationError(err);
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

	return (
		<div className={`connect-buttons ${direction}`}>
			{item.relation !== 'isMe' && (
				<>
					{' '}
					{handleRenderButtonFollow()}
					{handleRenderButtonFriend()}
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
};

export default ConnectButtonsFollower;
