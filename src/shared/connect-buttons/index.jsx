import { Add, Minus } from 'components/svg';
import { useState, useCallback, useRef, useEffect } from 'react';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import './connect-buttons.scss';
import { makeFriendRequest, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { replyFriendRequest } from 'reducers/redux-utils/user';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';
import _ from 'lodash';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';

const ConnectButtons = ({ direction, item }) => {
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);
	const [friendStatusBtn, setFriendStatusBtn] = useState(item.relation);
	const [followStatusBtn, setFollowStatusBtn] = useState(item.isFollow);
	const [requestStatus, setRequestStatus] = useState(item.friendRequest?.type);

	const oldFollowStatusBtn = useRef(item.isFollow);

	const dispatch = useDispatch();

	useEffect(() => {
		setFriendStatusBtn(item.relation);
		setFollowStatusBtn(item.isFollow);
		oldFollowStatusBtn.current = item.isFollow;
	}, [item]);

	// xu ly khi an nut them ban, huy ket ban, chap nhan loi moi ket ban
	const handleFriendBtn = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (friendStatusBtn === 'friend') {
				setShowModalUnfriends(true);
			} else if (friendStatusBtn === 'unknown') {
				handleAddFriend();
			} else if (requestStatus === 'requestToMe') {
				handleAcces();
			}
		}
	};

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

	const handleAcces = () => {
		try {
			const params = { id: item.friendRequest.id, data: { reply: true } };
			dispatch(replyFriendRequest(params)).unwrap();
			setFriendStatusBtn('friend');
			setFollowStatusBtn(true);
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

	// xu ly nut theo doi va huy theo doi
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
					oldFollowStatusBtn.current = currentStatus;
				}
			} catch (err) {
				NotificationError(err);
			}
		}, 700),
		[item]
	);

	const handleRenderButtonFriend = () => {
		let contentBtn = '';
		if (friendStatusBtn === 'friend') {
			contentBtn = 'Hủy kết bạn';
		} else if (friendStatusBtn === 'unknown') {
			contentBtn = 'Thêm bạn';
		} else {
			if (requestStatus === 'requestToMe') {
				contentBtn = 'Chấp nhận';
			} else if (requestStatus === 'sentRequest' || friendStatusBtn === 'pending') {
				contentBtn = 'Đã gửi lời mời';
			} else {
				contentBtn = 'Thêm bạn';
			}
		}

		return (
			<Button className='connect-button' onClick={handleFriendBtn}>
				{friendStatusBtn === 'unknown' && <Add className='connect-button__icon' />}
				{friendStatusBtn === 'friend' && <Minus className='connect-button__icon' />}
				<span className='connect-button__content'>{contentBtn}</span>
			</Button>
		);
	};

	const handleRenderButtonFollow = () => {
		// dat dieu kien cho 3 trtang thai cua nut follow
		let contentBtn = '';
		if (followStatusBtn === true) {
			contentBtn = 'Bỏ theo dõi';
		} else if (followStatusBtn === false) {
			contentBtn = 'Theo dõi';
		} else {
			contentBtn = 'Theo dõi';
		}

		return (
			<Button className='connect-button' isOutline={true} onClick={handleFollowAndUnfollow}>
				<span className='connect-button__content'>{contentBtn}</span>
			</Button>
		);
	};

	const toggleModal = () => {
		setShowModalUnfriends(!showModalUnfriends);
	};

	return (
		<div className={`connect-buttons ${direction}`}>
			{handleRenderButtonFriend()}
			{handleRenderButtonFollow()}
			<ModalUnFriend
				showModalUnfriends={showModalUnfriends}
				toggleModal={toggleModal}
				handleUnfriend={handleUnfriend}
				data={item}
			/>
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
