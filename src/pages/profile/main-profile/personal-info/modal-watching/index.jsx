import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { getListFollowing } from 'reducers/redux-utils/user';
import React, { useState, useEffect } from 'react';
import UserAvatar from 'shared/user-avatar';
import { Add } from 'components/svg';
import Button from 'shared/button';
import { unFollower, makeFriendRequest, unFriendRequest } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { buttonReqFriend } from 'helpers/HandleShare';
import { useParams, useNavigate } from 'react-router-dom';
import ModalUnFriend from 'pages/friends/component/modalUnFriends';
import _ from 'lodash';
import ConnectButtonsFollower from '../modal-followers/ConnectButtonsFollower';

const ModalWatching = ({ setModalFollowing, modalFollowing, userInfoDetail }) => {
	const navigate = useNavigate();
	const { userInfo } = useSelector(state => state.auth);
	const [getListFollow, setGetListFollow] = useState([]);
	const [inputSearch, setInputSearch] = useState('');
	const [showModalUnfriends, setShowModalUnfriends] = useState(false);
	const [userFriendRequest, setUserFriendRequest] = useState({});

	const dispatch = useDispatch();
	const { userId } = useParams();
	useEffect(async () => {
		const param = {
			userId: userId,
		};
		try {
			const followingList = await dispatch(getListFollowing(param)).unwrap();
			const newArrFriend = followingList.rows.map(item => {
				return { ...item, checkUnfollow: false, isPending: false, isAddFriend: true };
			});
			setGetListFollow(
				newArrFriend.filter(
					x =>
						x.userTwo?.firstName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase()) ||
						x.userTwo?.lastName.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase())
				)
			);
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch, inputSearch]);

	const unFolow = id => {
		try {
			dispatch(unFollower(id)).unwrap();
			const newArrFriend = getListFollow.map(item => {
				if (item.userIdTwo === id) {
					return { ...item, checkUnfollow: true };
				}
				return { ...item };
			});
			setGetListFollow(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleAddFriend = id => {
		const param = {
			userId: id,
		};
		try {
			dispatch(makeFriendRequest(param)).unwrap();
			const newArrFriend = getListFollow.map(item => {
				if (id === item.userIdTwo) {
					return { ...item, isPending: true };
				}
				return { ...item };
			});
			setGetListFollow(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnfriend = async () => {
		setShowModalUnfriends(false);
		try {
			const newArrFriend = getListFollow.map(item => {
				if (userFriendRequest.id === item.userIdTwo) {
					return { ...item, isAddFriend: false };
				}
				return { ...item };
			});
			setGetListFollow(newArrFriend);
			dispatch(unFriendRequest(userFriendRequest.id)).unwrap();
			unFolow(userFriendRequest.id);
		} catch (err) {
			NotificationError(err);
		}
	};

	const toggleModal = () => {
		setModalFollowing(!modalFollowing);
	};

	const toggleModalUnfriend = () => {
		setModalFollowing(!showModalUnfriends);
	};

	const buttonAddFriend = item => {
		return (
			<Button
				onClick={() => handleAddFriend(item.userIdTwo)}
				className='connect-button'
				isOutline={true}
				name='friend'
			>
				<Add className='connect-button__icon' />
				<span className='connect-button__content'>Kết bạn</span>
			</Button>
		);
	};

	const buttonUnFriend = item => {
		return (
			<Button onClick={() => handleModalUnFriend(item)} className='connect-button' isOutline={true} name='friend'>
				<span className='connect-button__content'>─ Hủy kết bạn</span>
			</Button>
		);
	};

	const handleModalUnFriend = item => {
		setShowModalUnfriends(true);
		setUserFriendRequest(item);
	};

	const renderButtonFriend = item => {
		if (item.relation === 'pending') {
			return buttonReqFriend();
		} else if (item.relation === 'friend') {
			return item.isAddFriend
				? buttonUnFriend(item)
				: item.isPending && item.isAddFriend === false
				? buttonReqFriend()
				: buttonAddFriend(item);
		} else if (item.relation === 'unknown') {
			return item.isPending ? buttonReqFriend() : buttonAddFriend(item);
		}
	};

	const onChangeInputSearch = e => {
		setInputSearch(e.target.value);
	};

	return (
		<>
			<Modal size='lg' className='modalFollowers__container__main' show={true} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Người {userInfoDetail.firstName} {userInfoDetail.lastName} đang theo dõi
						</div>
						<div className='modalFollowers__close'>
							<CloseX onClick={toggleModal} />
						</div>
					</div>
					<div className='modalFollowers__search'>
						<SearchField
							placeholder='Tìm kiếm trên Wisfeed'
							value={inputSearch}
							handleChange={onChangeInputSearch}
						/>
					</div>
					<div className='modalFollowers__info'>
						{getListFollow.map(item =>
							item.checkUnfollow ? (
								''
							) : (
								<div key={item.id} className='author-card'>
									<div className='author-card__left'>
										<UserAvatar
											source={item?.userTwo?.avatarImage}
											className='author-card__avatar'
											size={'md'}
											handleClick={() => {
												toggleModal(), navigate(`/profile/${item.userIdTwo}`);
											}}
										/>

										<div className='author-card__info'>
											<h5
												onClick={() => {
													toggleModal(), navigate(`/profile/${item.userIdTwo}`);
												}}
											>
												{item.userTwo.firstName} {item.userTwo.lastName}
											</h5>
											{!_.isEmpty(item?.dataCounting) && (
												<p className='author-card__subtitle'>
													{item?.dataCounting?.follower > 0
														? item?.dataCounting?.follower
														: 0}{' '}
													người theo dõi,{' '}
													{item?.dataCounting?.friend > 0 ? item?.dataCounting?.friend : 0}{' '}
													bạn bè
												</p>
											)}
										</div>
									</div>
									<div className='author-card__right'>
										{item.relation !== 'isMe' && (
											<ConnectButtonsFollower direction='row' item={item} isFollower={false} />
										)}
									</div>
								</div>
							)
						)}
					</div>
				</Modal.Body>
			</Modal>
			{/* <ModalUnFriend
				showModalUnfriends={showModalUnfriends}
				toggleModal={toggleModalUnfriend}
				handleUnfriend={handleUnfriend}
				data={userFriendRequest}
			/> */}
		</>
	);
};
ModalWatching.propTypes = {
	modalFollowing: PropTypes.bool,
	setModalFollowing: PropTypes.func,
	userInfoDetail: PropTypes.object,
};
export default ModalWatching;
