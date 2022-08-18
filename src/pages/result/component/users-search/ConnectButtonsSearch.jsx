import { useState, useCallback } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';
import { ReplyFriendRequest } from 'reducers/redux-utils/user';

const ConnectButtonsSearch = ({ direction, item }) => {
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);
	const [friendStatusBtn, setFriendStatusBtn] = useState(item.relation);
	const [followStatusBtn, setFollowStatusBtn] = useState(item.isFollow);

	const dispatch = useDispatch();

	const handleAddFriend = async () => {
		try {
			const param = {
				userId: item.id,
			};
			await dispatch(makeFriendRequest(param)).unwrap();
			setFriendStatusBtn((item.friendRequest.type = 'sentRequest'));
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnfriend = async () => {
		try {
			await dispatch(unFriendRequest(item.id)).unwrap();
			setFriendStatusBtn('unknown');
			setShowModalUnfriends(false);
			dispatch(unFollower(item.id)).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};
	const handleAcces = async () => {
		try {
			const params = { id: item.friendRequest.id, data: { reply: true } };
			setFriendStatusBtn('friend');

			dispatch(ReplyFriendRequest(params)).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleFriendBtn = () => {
		if (friendStatusBtn === 'friend') {
			setShowModalUnfriends(true);
		} else if (friendStatusBtn === 'unknown') {
			handleAddFriend();
		} else if (item.friendRequest?.type === 'requestToMe') {
			handleAcces();
		}
	};

	const handleFollowAndUnfollow = () => {
		setFollowStatusBtn(!followStatusBtn);
		handleCallFollowAndUnfollowApi(!followStatusBtn);
	};

	const handleCallFollowAndUnfollowApi = useCallback(
		_.debounce(currentStatus => {
			try {
				if (currentStatus) {
					dispatch(addFollower({ userId: item.id }));
				} else {
					dispatch(unFollower(item.id)).unwrap();
				}
			} catch (err) {
				NotificationError(err);
			}
		}, 1500),
		[]
	);

	const handleRenderButtonFriend = () => {
		let contentBtn = '';
		if (friendStatusBtn === 'friend') {
			contentBtn = 'Hủy kết bạn';
		} else if (friendStatusBtn === 'unknown') {
			contentBtn = 'Kết bạn';
		} else if (item.friendRequest?.type === 'requestToMe') {
			contentBtn = 'Chấp nhận';
		} else if (item.friendRequest?.type === 'sentRequest') {
			contentBtn = 'Đã gửi lời mời';
		}

		return (
			<Button className='myfriends__button' onClick={handleFriendBtn}>
				<span className='myfriends__button__content'>{contentBtn}</span>
			</Button>
		);
	};

	const handleRenderButtonFollow = () => {
		return (
			<Button className='myfriends__button' isOutline={true} name='friend' onClick={handleFollowAndUnfollow}>
				<span className='myfriends__button__content'>{followStatusBtn ? 'Bỏ theo dõi' : 'Theo dõi'} </span>
			</Button>
		);
	};

	const toggleModal = () => {
		setShowModalUnfriends(!showModalUnfriends);
	};

	return (
		<div className={`myfriends__buttons ${direction}`}>
			{item.relation !== 'isMe' && (
				<>
					{handleRenderButtonFriend()}
					{handleRenderButtonFollow()}
					<ModalUnFriend
						showModalUnfriends={showModalUnfriends}
						toggleModal={toggleModal}
						data={item}
						handleUnfriend={handleUnfriend}
					/>
				</>
			)}
		</div>
	);
};

ConnectButtonsSearch.defaultProps = {
	item: {},
	direction: 'column',
};

ConnectButtonsSearch.propTypes = {
	item: PropTypes.object,
	direction: PropTypes.oneOf(['row', 'column']),
};

export default ConnectButtonsSearch;
