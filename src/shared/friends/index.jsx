import Button from 'shared/button';
import PropTypes from 'prop-types';
import './friends.scss';
import { Subtract } from 'components/svg';
import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';
import {
	makeFriendRequest,
	addFollower,
	unFollower,
	replyFriendRequest,
	unFriendRequest,
} from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const FriendsItem = ({ data, keyTabs, listFollower, listFriendReq, listFollowings, listSuggest, type }) => {
	const dispatch = useDispatch();
	const invitation = location.pathname === '/friends/invitation';
	const following = location.pathname === '/friends/following';
	const follower = location.pathname === '/friends/follower';
	const suggestions = location.pathname === '/friends/suggestions';
	const recommend = location.pathname === '/friends/recommend';
	const [unFriend, setUnFriend] = useState(true);
	const [toggleUnFollow, setToggleUnFollow] = useState(true);
	const [toggleAddFriend, setToggleAddFriend] = useState(true);
	const [togglePendingFriend, setTogglePendingFriend] = useState(true);
	const [toggleAcceptButton, setToggleAcceptButton] = useState(true);
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);

	const [isFollow, setIsFollow] = useState(false);

	useEffect(() => {
		data.isFollow ? setIsFollow(true) : setIsFollow(false);
	}, []);

	const handleModalUnFriend = () => {
		setShowModalUnfriends(true);
	};

	const handleUnfriend = () => {
		setShowModalUnfriends(false);
		try {
			if (listFollower) {
				dispatch(unFriendRequest(data.userOne.id));
			} else if (listFriendReq || listFollowings) {
				dispatch(unFriendRequest(data.userTwo.id));
			} else {
				dispatch(unFriendRequest(data.id));
			}
			setUnFriend(false);
			setToggleAddFriend(false);

			setIsFollow(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnFollow = async () => {
		try {
			if (data.userOne) {
				await dispatch(unFollower(data.userOne.id)).unwrap();
			} else {
				await dispatch(unFollower(data.id)).unwrap();
			}

			setToggleUnFollow(false);

			setIsFollow(false);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddFollow = async () => {
		try {
			if (data.userOne) {
				await dispatch(addFollower({ userId: data.userOne.id })).unwrap();
			} else {
				await dispatch(addFollower({ userId: data.id })).unwrap();
			}

			setToggleUnFollow(true);

			setIsFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddFriends = () => {
		try {
			if (listFollower || listFollowings) {
				const param = {
					userId: data.userOne.id,
				};
				dispatch(makeFriendRequest(param)).unwrap();
			} else if (listFriendReq || listFollowings) {
				const param = {
					userId: data.id,
				};
				dispatch(makeFriendRequest(param)).unwrap();
			} else {
				const param = {
					userId: data.id,
				};
				dispatch(makeFriendRequest(param)).unwrap();
			}
			setTogglePendingFriend(false);

			setIsFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleReplyFriendReq = () => {
		const params = { id: data.friendRequest?.id || data.id, data: { reply: true } };
		try {
			setToggleAcceptButton(false);
			dispatch(replyFriendRequest(params)).unwrap();
			setIsFollow(true);
		} catch (err) {
			NotificationError(err);
		}
	};

	const buttonUnFriend = () => {
		return (
			<Button onClick={handleModalUnFriend} className='myfriends__button' isOutline={false} name='friend'>
				<span className='myfriends__button__content'>Hủy kết bạn</span>
			</Button>
		);
	};

	const buttonAddFriend = () => {
		return (
			<Button onClick={handleAddFriends} className='myfriends__button' isOutline={false} name='friend'>
				<span className='myfriends__button__content'>Kết bạn</span>
			</Button>
		);
	};

	const buttonPending = () => {
		return (
			<Button className='myfriends__button' isOutline={false} name='friend'>
				<span className='myfriends__button__content'>Đã gửi lời mời</span>
			</Button>
		);
	};

	const buttonFollow = () => {
		return (
			<Button onClick={handleAddFollow} className='myfriends__button' isOutline name='friend'>
				<span className='myfriends__button__content'>Theo dõi</span>
			</Button>
		);
	};

	const buttonUnfollow = () => {
		return (
			<Button onClick={handleUnFollow} className='myfriends__button' isOutline name='friend'>
				<span className='myfriends__button__content'>Bỏ theo dõi</span>
			</Button>
		);
	};

	const buttonAcceptfriend = () => {
		return (
			<Button onClick={handleReplyFriendReq} className='myfriends__button' isOutline={false} name='friend'>
				<span className='myfriends__button__content'>
					{toggleAcceptButton ? 'Xác nhận' : 'Đã chấp nhận lời mời'}
				</span>
			</Button>
		);
	};

	const renderButtonFriends = () => {
		if (keyTabs === 'friend') {
			return buttonUnFriend();
		} else if (keyTabs === 'follow' || following || follower) {
			if (data.relation === 'friend') {
				return toggleAddFriend ? buttonUnFriend() : togglePendingFriend ? buttonAddFriend() : buttonPending();
			} else if (data.relation === 'unknown') {
				return togglePendingFriend ? buttonAddFriend() : buttonPending();
			} else {
				return buttonPending();
			}
		} else if (keyTabs === 'suggest' || suggestions || recommend) {
			if (data.relation === 'unknown' || data.relation === undefined) {
				return togglePendingFriend ? buttonAddFriend() : buttonPending();
			} else if (data.friendRequest.type === 'requestToMe') {
				return buttonAcceptfriend();
			} else {
				return buttonPending();
			}
		} else if (keyTabs === 'addfriend' || invitation) {
			return buttonAcceptfriend();
		} else {
			return buttonAddFriend();
		}
	};

	const renderButtonFollow = () => {
		return isFollow ? buttonUnfollow() : buttonFollow();
	};

	const renderDisplay = () => {
		return (
			<div className='myfriends__layout'>
				<Link to={`/profile/${data.userTwo?.id || data.id}`}>
					<img
						className='myfriends__layout__img'
						src={data.userTwo?.avatarImage || data?.avatarImage || defaultAvatar}
						alt='image'
						onError={e => e.target.setAttribute('src', `${defaultAvatar}`)}
					/>

					<div className='myfriends__star'>
						<div
							className='myfriends__star__name'
							title={
								data.userTwo?.fullName
									? data.userTwo?.fullName
									: data.fullName
									? data.fullName
									: data.firstName + ' ' + data.lastName
							}
						>
							{data.userTwo?.fullName
								? data.userTwo?.fullName
								: data.fullName
								? data.fullName
								: data.firstName + ' ' + data.lastName}
						</div>
						{data.isStar && <Subtract />}
					</div>
				</Link>

				<div className='myfriends__button__container'>
					{renderButtonFriends()}
					{renderButtonFollow()}
				</div>
			</div>
		);
	};

	const renderFollowerDisplay = () => {
		return (
			<div className='myfriends__layout'>
				<Link to={`/profile/${data.userOne.id}`}>
					<img
						className='myfriends__layout__img'
						src={data.userOne.avatarImage ? data.userOne.avatarImage : defaultAvatar}
						alt='image'
						onError={e => e.target.setAttribute('src', `${defaultAvatar}`)}
					/>
					<div className='myfriends__star'>
						<div
							className='myfriends__star__name'
							title={
								data.userOne.fullName ? (
									data.userOne.fullName
								) : (
									<>
										<span>{data.userOne.firstName}</span>&nbsp;
										<span>{data.userOne.lastName}</span>
									</>
								)
							}
						>
							{data.userOne.fullName ? (
								data.userOne.fullName
							) : (
								<>
									<span>{data.userOne.firstName}</span>&nbsp;
									<span>{data.userOne.lastName}</span>
								</>
							)}
						</div>
						{data.isStar && <Subtract />}
					</div>
				</Link>
				<div className='myfriends__button__container'>
					{renderButtonFriends()}
					{renderButtonFollow()}
				</div>
			</div>
		);
	};

	const renderFriend = () => {
		return (
			<div className='myfriends__layout'>
				<Link to={`/profile/${data.id}`}>
					<img
						className='myfriends__layout__img'
						src={data.avatarImage ? data.avatarImage : defaultAvatar}
						alt='image'
						onError={e => e.target.setAttribute('src', `${defaultAvatar}`)}
					/>
					<div className='myfriends__star'>
						<div
							className='myfriends__star__name'
							title={data.fullName ? data.fullName : data.firstName + data.lastName}
						>
							{data.fullName ? (
								data.fullName
							) : (
								<>
									<span>{data.firstName}</span>&nbsp;
									<span>{data.lastName}</span>
								</>
							)}
						</div>
						{data.isStar && <Subtract />}
					</div>
					{data.mutualFriend > 0 && (
						<div className='myFriend__mutualFriend'>({data.mutualFriend} bạn chung)</div>
					)}
				</Link>
				<div className='myfriends__button__container'>
					{renderButtonFriends()}
					{renderButtonFollow()}
				</div>
			</div>
		);
	};

	const handleRenderDisplay = () => {
		if (keyTabs === 'friend') {
			return unFriend && renderFriend();
		} else if (keyTabs === 'follow' || following || follower) {
			if (listFollower || follower) {
				return renderFollowerDisplay();
			}
			return toggleUnFollow && renderDisplay();
		} else if (keyTabs === 'addfriend' || invitation) {
			if (listFriendReq) {
				return renderFollowerDisplay();
			}
			return renderDisplay();
		} else {
			return renderDisplay();
		}
	};

	const toggleModal = () => {
		setShowModalUnfriends(!showModalUnfriends);
	};

	return (
		<>
			<ModalUnFriend
				showModalUnfriends={showModalUnfriends}
				toggleModal={toggleModal}
				handleUnfriend={handleUnfriend}
				data={data}
				type={type}
			/>
			{handleRenderDisplay()}
		</>
	);
};

FriendsItem.propTypes = {
	data: PropTypes.object,
	keyTabs: PropTypes.string,
	listFollower: PropTypes.array,
	listFriendReq: PropTypes.array,
	listFollowings: PropTypes.array,
	listSuggest: PropTypes.array,
	getListRecommends: PropTypes.array,
	type: PropTypes.string,
};
export default FriendsItem;
