import { Add, Minus } from 'components/svg';
import { useState } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';

const ConnectButtonsFriends = ({ direction, item }) => {
	const dispatch = useDispatch();
	const [unFriend, setUnFriend] = useState(true);
	const [toggleUnFollow, setToggleUnFollow] = useState(true);
	const [toggleAddFollow, setToggleAddFollow] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);

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

	const handleModalUnFriend = () => {
		setShowModalUnfriends(true);
	};

	const buttonUnFriend = () => {
		return (
			<Button className='connect-button' onClick={handleModalUnFriend}>
				<Minus className='connect-button__icon' />
				<span className='connect-button__content'>Hủy kết bạn</span>
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
	const handleUnfriend = () => {
		setShowModalUnfriends(false);
		try {
			dispatch(unFriendRequest(item.id)).unwrap();
			setUnFriend(false);
			handleUnFollow();
		} catch (err) {
			NotificationError(err);
		}
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
		return unFriend ? buttonUnFriend() : togglePendingFriend ? buttonAddFriend() : buttonPendingFriend();
	};

	const toggleModal = () => {
		setShowModalUnfriends(!showModalUnfriends);
	};

	return (
		<div className={`connect-buttons ${direction}`}>
			<>
				{' '}
				{handleRenderButtonFriend()}
				{handleRenderButtonFollow()}
				<ModalUnFriend
					showModalUnfriends={showModalUnfriends}
					toggleModal={toggleModal}
					handleUnfriend={handleUnfriend}
					data={item}
				/>
			</>
		</div>
	);
};

ConnectButtonsFriends.defaultProps = {
	data: {
		isFriend: false,
		isFollow: false,
	},
	direction: 'column',
};

ConnectButtonsFriends.propTypes = {
	data: PropTypes.shape({
		isFollow: PropTypes.bool.isRequired,
		isFriend: PropTypes.bool.isRequired,
	}),
	item: PropTypes.object,
	direction: PropTypes.oneOf(['row', 'column']),
};

export default ConnectButtonsFriends;
