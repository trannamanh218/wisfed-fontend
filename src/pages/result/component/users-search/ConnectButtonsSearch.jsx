import { useState, useCallback, useRef } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';
import { ReplyFriendRequest } from 'reducers/redux-utils/user';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import Storage from 'helpers/Storage';

const ConnectButtonsSearch = ({ direction, item }) => {
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);
	const [friendStatusBtn, setFriendStatusBtn] = useState(item.relation);
	const [followStatusBtn, setFollowStatusBtn] = useState(item.isFollow);
	const [requestStatus, setRequestStatus] = useState(item.friendRequest?.type);

	const oldFollowStatusBtn = useRef(item.isFollow);

	const dispatch = useDispatch();

	// xu ly khi an nut them ban, huy ket ban, chap nhan loi moi ket ban
	const handleAddFriend = async () => {
		try {
			const param = {
				userId: item.id,
			};
			await dispatch(makeFriendRequest(param)).unwrap();
			setFriendStatusBtn('sentRequest');
			setRequestStatus('sentRequest');
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnfriend = async () => {
		try {
			await dispatch(unFriendRequest(item.id)).unwrap();
			setFriendStatusBtn('unknown');
			setFollowStatusBtn(false);
			setShowModalUnfriends(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAcces = () => {
		try {
			const params = { id: item.friendRequest.id, data: { reply: true } };
			dispatch(ReplyFriendRequest(params)).unwrap();
			setFriendStatusBtn('friend');
			setFollowStatusBtn(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleFriendBtn = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (friendStatusBtn === 'friend') {
				setShowModalUnfriends(true);
			} else if (friendStatusBtn === 'unknown') {
				handleAddFriend();
			} else if (item.friendRequest?.type === 'requestToMe') {
				handleAcces();
			}
		}
	};

	// xu ly khi an nut theo doi va huy theo doi
	const handleFollowAndUnfollow = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			setFollowStatusBtn(!followStatusBtn);
			handleCallFollowAndUnfollowApi(!followStatusBtn);
		}
	};

	const handleCallFollowAndUnfollowApi = useCallback(
		_.debounce(currentStatus => {
			try {
				if (currentStatus !== oldFollowStatusBtn.current) {
					if (currentStatus) {
						dispatch(addFollower({ userId: item.id }));
					} else {
						dispatch(unFollower(item.id)).unwrap();
					}
				}
			} catch (err) {
				NotificationError(err);
			}
		}, 700),
		[]
	);

	const handleRenderButtonFriend = () => {
		let contentBtn = '';
		if (friendStatusBtn === 'friend') {
			contentBtn = 'Hủy kết bạn';
		} else if (friendStatusBtn === 'unknown') {
			contentBtn = 'Kết bạn';
		} else {
			if (requestStatus === 'requestToMe') {
				contentBtn = 'Chấp nhận';
			} else if (requestStatus === 'sentRequest') {
				contentBtn = 'Đã gửi lời mời';
			} else {
				contentBtn = 'Kết bạn';
			}
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
			{handleRenderButtonFriend()}
			{handleRenderButtonFollow()}
			<ModalUnFriend
				showModalUnfriends={showModalUnfriends}
				toggleModal={toggleModal}
				data={item}
				handleUnfriend={handleUnfriend}
			/>
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
