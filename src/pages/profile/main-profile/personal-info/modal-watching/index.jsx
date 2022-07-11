import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { getListFollowing } from 'reducers/redux-utils/user';
import React, { useState, useEffect } from 'react';
import UserAvatar from 'shared/user-avatar';
import { Add, Minus } from 'components/svg';
import Button from 'shared/button';
import { unFollower, makeFriendRequest, unFriendRequest } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { buttonReqFriend } from 'helpers/HandleShare';
import { useParams } from 'react-router-dom';

const ModalWatching = ({ setModalFollowing, modalFollowing, userInfoDetail }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getListFollow, setGetListFollow] = useState([]);
	// const [inputSearch, setInputSearch] = useSelector('');
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
			setGetListFollow(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch]);

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

	const handleUnFriend = id => {
		try {
			const newArrFriend = getListFollow.map(item => {
				if (id === item.userIdTwo) {
					return { ...item, isAddFriend: false };
				}
				return { ...item };
			});
			setGetListFollow(newArrFriend);
			dispatch(unFriendRequest(id)).unwrap();
		} catch (err) {
			NotificationError(err);
		}
	};

	const toggleModal = () => {
		setModalFollowing(!modalFollowing);
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
			return item.isAddFriend
				? buttonUnFriend(item)
				: item.isPending && item.isAddFriend === false
				? buttonReqFriend()
				: buttonAddFriend(item);
		} else if (item.relation === 'unknown') {
			return item.isPending ? buttonReqFriend() : buttonAddFriend(item);
		}
	};

	// const onChangeInputSearch = e => {
	// 	setInputSearch(e.target.value);
	// };

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
							// value={inputSearch}
							// handleChange={onChangeInputSearch}
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
										/>
										<div className='author-card__info'>
											<h5>
												{item.userTwo.firstName} {item.userTwo.lastName}
											</h5>
											<p className='author-card__subtitle'>3k follow, 300 bạn bè</p>
										</div>
									</div>
									<div className='author-card__right'>
										{item.relation !== 'isMe' && (
											<div className='connect-buttons row'>
												<Button
													onClick={() => {
														unFolow(item.userIdTwo);
													}}
													className='connect-button follow'
												>
													<span className='connect-button__content'>Hủy theo dõi </span>
												</Button>
												{renderButtonFriend(item)}
											</div>
										)}
									</div>
								</div>
							)
						)}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
ModalWatching.propTypes = {
	modalFollowing: PropTypes.bool,
	setModalFollowing: PropTypes.func,
	userInfoDetail: PropTypes.object,
};
export default ModalWatching;
