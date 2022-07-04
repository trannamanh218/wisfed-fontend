import './modal-followers.scss';
import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { getListFollowrs, makeFriendRequest, unFriendRequest } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import UserAvatar from 'shared/user-avatar';
import Button from 'shared/button';
import { Add, Minus } from 'components/svg';
import { buttonReqFriend } from 'helpers/HandleShare';
import { useParams } from 'react-router-dom';

const ModalFollowers = ({ modalFollower, setModalFollower, userInfoDetail }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFollowing, setGetMyListFollowing] = useState([]);
	const dispatch = useDispatch();
	const { userId } = useParams();
	useEffect(async () => {
		const param = {
			userId: userId,
		};
		try {
			const followList = await dispatch(getListFollowrs(param)).unwrap();
			const newArrFriend = followList.rows.map(item => {
				return { ...item, checkUnfollow: false, isPending: false, isAddFriend: true };
			});
			setGetMyListFollowing(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch]);

	const toggleModal = () => {
		setModalFollower(!modalFollower);
	};

	const handleAddFriend = id => {
		const param = {
			userId: id,
		};
		try {
			dispatch(makeFriendRequest(param)).unwrap();
			const newArrFriend = getMyListFollowing.map(item => {
				if (id === item.userIdTwo) {
					return { ...item, isPending: true };
				}
				return { ...item };
			});
			setGetMyListFollowing(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnFriend = id => {
		try {
			const newArrFriend = getMyListFollowing.map(item => {
				if (id === item.userIdTwo) {
					return { ...item, isAddFriend: false };
				}
				return { ...item };
			});
			setGetMyListFollowing(newArrFriend);
			dispatch(unFriendRequest(id)).unwrap();
		} catch (err) {
			NotificationError(err);
		}
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
			<Button
				onClick={() => handleUnFriend(item.userIdTwo)}
				className='connect-button'
				isOutline={true}
				name='friend'
			>
				<Minus className='connect-button__icon' />
				<span className='connect-button__content'>Hủy kết bạn</span>
			</Button>
		);
	};

	const renderButtonFriend = item => {
		if (item.relation === 'pending') {
			return buttonReqFriend();
		} else if (item.relation === 'friend') {
			return item.isAddFriend ? buttonUnFriend(item) : item.isPending ? buttonReqFriend() : buttonAddFriend(item);
		} else if (item.relation === 'unknown') {
			return item.isPending ? buttonReqFriend() : buttonAddFriend(item);
		}
	};

	return (
		<>
			<Modal size='lg' className='modalFollowers__container__main' show={modalFollower} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Người theo dõi {userInfoDetail.firstName} {userInfoDetail.lastName}
						</div>
						<div className='modalFollowers__close'>
							<CloseX onClick={toggleModal} />
						</div>
					</div>
					<div className='modalFollowers__search'>
						<SearchField placeholder='Tìm kiếm trên Wisfeed' />
					</div>
					<div className='modalFollowers__info'>
						{getMyListFollowing.map(item => (
							<div key={item.id} className='author-card'>
								<div className='author-card__left'>
									<UserAvatar
										source={item.userOne.avatarImage}
										className='author-card__avatar'
										size={'md'}
									/>
									<div className='author-card__info'>
										<h5>
											{item.userOne.firstName} {item.userOne.lastName}
										</h5>
										<p className='author-card__subtitle'>3K follow, 300 bạn bè</p>
									</div>
								</div>
								<div className='author-card__right'>
									{item.relation !== 'isMe' && (
										<div className='connect-buttons row'>
											<Button className='connect-button follow'>
												<span className='connect-button__content'> Theo dõi </span>
											</Button>
											{renderButtonFriend(item)}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
ModalFollowers.propTypes = {
	setModalFollower: PropTypes.func,
	modalFollower: PropTypes.bool,
	userInfoDetail: PropTypes.object,
};
export default ModalFollowers;
