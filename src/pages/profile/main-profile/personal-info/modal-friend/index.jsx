import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { getFriendList, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import Button from 'shared/button';
import { Minus } from 'components/svg';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';

const ModalFriend = ({ setModalFriend, modalFriend, userInfoDetail }) => {
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFriend, setGetMyListFriend] = useState([]);
	const dispatch = useDispatch();
	const { userId } = useParams();

	const unFolow = id => {
		try {
			dispatch(unFollower(id)).unwrap();
			const newArrFriend = getMyListFriend.map(item => {
				if (item.userIdTwo === id) {
					return { ...item, checkUnfollow: true, checkFolow: false };
				}
				return { ...item };
			});
			setGetMyListFriend(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	};

	const addFolow = id => {
		const param = {
			data: { userId: id },
		};
		try {
			dispatch(addFollower(param)).unwrap();
			const newArrFriend = getMyListFriend.map(item => {
				if (item.userIdTwo === id) {
					return { ...item, checkFolow: true, checkUnfollow: false };
				}
				return { ...item };
			});
			setGetMyListFriend(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUnFriend = id => {
		try {
			dispatch(unFriendRequest(id)).unwrap();
			const newArrFriend = getMyListFriend.map(item => {
				if (item.userIdTwo === id) {
					return { ...item, checkUnfriend: false };
				}
				return { ...item };
			});
			setGetMyListFriend(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	};

	const toggleModal = () => {
		setModalFriend(!modalFriend);
	};

	const renderButtonFollows = item => {
		return item.isFollow ? (
			item.checkUnfollow ? (
				<Button onClick={() => addFolow(item.userIdTwo)} className='connect-button follow'>
					<span className='connect-button__content'>Theo dõi </span>
				</Button>
			) : (
				<Button onClick={() => unFolow(item.userIdTwo)} className='connect-button follow'>
					<span className='connect-button__content'>Hủy theo dõi </span>
				</Button>
			)
		) : item.checkFolow ? (
			<Button onClick={() => unFolow(item.userIdTwo)} className='connect-button follow'>
				<span className='connect-button__content'>Hủy theo dõi </span>
			</Button>
		) : (
			<Button onClick={() => addFolow(item.userIdTwo)} className='connect-button follow'>
				<span className='connect-button__content'>Theo dõi </span>
			</Button>
		);
	};

	useEffect(async () => {
		const param = {
			userId: userId,
		};
		try {
			const friendList = await dispatch(getFriendList(param)).unwrap();
			const newArrFriend = friendList.rows.map(item => {
				return { ...item, checkFolow: false, checkUnfollow: false, checkUnfriend: true };
			});
			setGetMyListFriend(newArrFriend);
		} catch (err) {
			NotificationError(err);
		}
	}, [userInfo, dispatch]);

	return (
		<>
			<Modal size='lg' className='modalFollowers__container__main' show={true} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Bạn bè của {userInfoDetail.firstName} {userInfoDetail.lastName}
						</div>
						<div className='modalFollowers__close'>
							<CloseX onClick={toggleModal} />
						</div>
					</div>
					<div className='modalFollowers__search'>
						<SearchField placeholder='Tìm kiếm trên Wisfeed' />
					</div>
					<div className='modalFollowers__info'>
						{getMyListFriend.map(item =>
							item.checkUnfriend ? (
								<div key={item.id} className='author-card'>
									<div className='author-card__left'>
										<UserAvatar
											source={item.userTwo.avatarImage}
											className='author-card__avatar'
											size={'md'}
										/>
										<div className='author-card__info'>
											<h5>
												{item.userTwo.firstName} {item.userTwo.lastName}
											</h5>
											<p className='author-card__subtitle'>3K follow, 300 bạn bè</p>
										</div>
									</div>
									<div className='author-card__right'>
										{item.userTwo.id !== userInfo.id && (
											<div className='connect-buttons row'>
												{renderButtonFollows(item)}
												<Button
													className='connect-button'
													isOutline={true}
													name='friend'
													onClick={() => handleUnFriend(item.userIdTwo)}
												>
													<Minus className='connect-button__icon' />
													<span className='connect-button__content'>Huỷ kết bạn</span>
												</Button>
											</div>
										)}
									</div>
								</div>
							) : (
								''
							)
						)}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
ModalFriend.propTypes = {
	setModalFriend: PropTypes.func,
	modalFriend: PropTypes.bool,
	userInfoDetail: PropTypes.object,
};
export default ModalFriend;
