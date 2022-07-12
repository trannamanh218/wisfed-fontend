import { useState } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

const ConnectButtonsSearch = ({ direction, item }) => {
	const dispatch = useDispatch();
	const [unFriend, setUnFriend] = useState(true);
	const [toggleUnFollow, setToggleUnFollow] = useState(true);
	const [toggleAddFollow, setToggleAddFollow] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);

	const buttonUnFollow = () => {
		return (
			<Button className='myfriends__button' isOutline={true} name='friend' onClick={handleUnFollow}>
				<span className='myfriends__button__content'>Bỏ theo dõi </span>
			</Button>
		);
	};

	const buttonAddFollow = () => {
		return (
			<Button className=' myfriends__button' isOutline={true} name='friend' onClick={handleFollow}>
				<span className='myfriends__button__content'>Theo dõi </span>
			</Button>
		);
	};

	const buttonAddFriend = () => {
		return (
			<Button className='myfriends__button' onClick={handleAddFriend}>
				<span className='myfriends__button__content'>Kết bạn</span>
			</Button>
		);
	};

	const buttonUnFriend = () => {
		return (
			<Button className='myfriends__button' onClick={handleUnFriend}>
				<span className='myfriends__button__content'>Huỷ kết bạn</span>
			</Button>
		);
	};

	const buttonPendingFriend = () => {
		return (
			<Button className='myfriends__button'>
				<span className='myfriends__button__content'>Đã gửi lời mời</span>
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
		if (item.relation === 'friend') {
			return unFriend ? buttonUnFriend() : togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
		} else if (item.relation === 'pending') {
			return buttonPendingFriend();
		} else if (item.relation === 'unknown') {
			return togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
		}
	};

	return (
		<div className={`myfriends__buttons ${direction}`}>
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

ConnectButtonsSearch.defaultProps = {
	data: {
		isFriend: false,
		isFollow: false,
	},
	direction: 'column',
};

ConnectButtonsSearch.propTypes = {
	data: PropTypes.shape({
		isFollow: PropTypes.bool.isRequired,
		isFriend: PropTypes.bool.isRequired,
	}),
	item: PropTypes.object,
	direction: PropTypes.oneOf(['row', 'column']),
};

export default ConnectButtonsSearch;
