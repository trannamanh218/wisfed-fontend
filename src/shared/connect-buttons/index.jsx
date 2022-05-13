import { Add, Minus } from 'components/svg';
import React, { useState } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import './connect-buttons.scss';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

const ConnectButtons = ({ data, direction, item }) => {
	const dispatch = useDispatch();
	const [unFriend, setUnFriend] = useState(true);
	const [toggleUnFollow, setToggleUnFollow] = useState(true);
	const [toggleAddFollow, setToggleAddFollow] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [toggleModalUnFriends, setModalUnfriends] = useState(false);

	const buttonUnFollow = () => {
		return (
			<Button className='connect-button follow' isOutline={true} name='friend' onClick={handleUnFollow}>
				<span className='connect-button__content follow'>Hủy theo dõi </span>
			</Button>
		);
	};

	const buttonAddFollow = () => {
		return (
			<Button className=' connect-button follow' isOutline={true} name='friend' onClick={handleFollow}>
				<span className='connect-button__content follow'>Theo dõi </span>
			</Button>
		);
	};

	const buttonAddFriend = () => {
		return (
			<Button className='connect-button' onClick={handleAddFriend}>
				<Add className='connect-button__icon' />

				<span className='connect-button__content'>Kết bạn</span>
			</Button>
		);
	};

	const buttonUnFriend = () => {
		return (
			<Button className='connect-button' onClick={handleUnFriend}>
				<Minus className='connect-button__icon' />
				<span className='connect-button__content'>Huỷ kết bạn</span>
			</Button>
		);
	};

	const buttonPendingFriend = () => {
		return (
			<Button className='connect-button'>
				<Minus className='connect-button__icon' />
				<span className='connect-button__content'>Đã gửi lời mời</span>
			</Button>
		);
	};

	const handleAddFriend = () => {
		try {
			const param = {
				userId: item.id,
			};
			dispatch(makeFriendRequest(param)).unwrap();
			setTogglePendingFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleUnFriend = () => {
		setModalUnfriends(false);
		try {
			dispatch(unFriendRequest(item.id)).unwrap();
			setUnFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleFollow = () => {
		try {
			const param = {
				data: { userId: item.id },
			};
			dispatch(addFollower(param)).unwrap();
			setToggleAddFollow(false);
			setToggleUnFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleUnFollow = () => {
		try {
			dispatch(unFollower(item.id)).unwrap();
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
		if (item.isFriend) {
			return unFriend ? buttonUnFriend() : togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
		} else {
			if (item.pending) {
				return buttonPendingFriend();
			} else {
				return togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
			}
		}
	};

	return (
		<div className={`connect-buttons ${direction}`}>
			{handleRenderButtonFriend()}
			{handleRenderButtonFollow()}
		</div>
	);
};

ConnectButtons.defaultProps = {
	data: {
		isFriend: false,
		isFollow: false,
	},
	direction: 'column',
};

ConnectButtons.propTypes = {
	data: PropTypes.shape({
		isFollow: PropTypes.bool.isRequired,
		isFriend: PropTypes.bool.isRequired,
	}),
	item: PropTypes.object,
	direction: PropTypes.oneOf(['row', 'column']),
};

export default ConnectButtons;
