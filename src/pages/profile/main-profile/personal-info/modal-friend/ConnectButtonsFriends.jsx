import { Add } from 'components/svg';
import { useState, useEffect } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';

const ConnectButtonsFriends = ({ direction, item }) => {
	const dispatch = useDispatch();
	const [unFriend, setUnFriend] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);
	const [isFollow, setIsFollow] = useState(false);

	useEffect(() => {
		item.isFollow && setIsFollow(true);
	}, []);

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
			<Button className='connect-button' onClick={() => setShowModalUnfriends(true)}>
				<span className='connect-button__content'>─&nbsp;&nbsp; Hủy kết bạn</span>
			</Button>
		);
	};

	const buttonPendingFriend = () => {
		return (
			<Button className='connect-button'>
				<span className='connect-button__content'>&nbsp;&nbsp; Đã gửi lời mời</span>
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
			handleUnFollow();
			dispatch(unFriendRequest(item.id)).unwrap();
			setUnFriend(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleFollow = async () => {
		try {
			await dispatch(addFollower({ userId: item.id })).unwrap();
			setIsFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleUnFollow = async () => {
		try {
			await dispatch(unFollower(item.id)).unwrap();
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

	const toggleModal = () => {
		setShowModalUnfriends(!showModalUnfriends);
	};

	return (
		<div className={`connect-buttons ${direction}`}>
			<>
				{handleRenderButtonFriend()}
				<Button
					className='connect-button follow'
					isOutline
					name='friend'
					onClick={isFollow ? handleUnFollow : handleFollow}
				>
					<span className='connect-button__content follow'>{isFollow ? 'Bỏ theo dõi' : 'Theo dõi'}</span>
				</Button>
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
