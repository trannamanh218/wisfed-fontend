import { Add, Minus } from 'components/svg';
import { useState } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import './connect-buttons.scss';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { ReplyFriendRequest } from 'reducers/redux-utils/user';

const ConnectButtons = ({ direction, item }) => {
	const dispatch = useDispatch();
	const [unFriend, setUnFriend] = useState(true);
	const [toggleUnFollow, setToggleUnFollow] = useState(true);
	const [toggleAddFollow, setToggleAddFollow] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [toggleAcces, setToggleAcces] = useState(true);

	const buttonUnFollow = () => {
		return (
			<Button className='connect-button follow' isOutline={true} name='friend' onClick={handleUnFollow}>
				<span className='connect-button__content follow'>Bỏ theo dõi </span>
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

	const buttonAcces = () => {
		return (
			<Button className='connect-button' onClick={handleAcces}>
				<span className='connect-button__content'>Chấp nhận</span>
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
		// setModalUnfriends(false);
		try {
			dispatch(unFriendRequest(item.id)).unwrap();
			setUnFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAcces = () => {
		const params = { id: item.friendRequest.id, data: { reply: true } };
		setToggleAcces(false);
		dispatch(ReplyFriendRequest(params)).unwrap();
	};

	const handleFollow = () => {
		try {
			dispatch(addFollower({ userId: item.id }));
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
		if (item.relation === 'friend') {
			return unFriend ? buttonUnFriend() : togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
		} else if (item.relation === 'pending') {
			return buttonPendingFriend();
		} else if (item.relation === 'unknown' && !item.friendRequest) {
			return togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
		} else if (item.friendRequest.type === 'requestToMe') {
			return toggleAcces ? buttonAcces() : buttonUnFriend();
		}
	};

	return (
		<div className={`connect-buttons ${direction}`}>
			{item.relation !== 'isMe' && (
				<>
					{' '}
					{handleRenderButtonFriend()}
					{handleRenderButtonFollow()}
				</>
			)}
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
