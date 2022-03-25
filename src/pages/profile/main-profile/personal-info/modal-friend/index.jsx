import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
// import AuthorCard from 'shared/author-card';
// import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useModal } from 'shared/hooks';
import { getFriendList, addFollower, unFollower, unFriendRequest } from 'reducers/redux-utils/user';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
// import ConnectButtons from 'shared/connect-buttons';
import UserAvatar from 'shared/user-avatar';
import Button from 'shared/button';
import { Minus } from 'components/svg';
import _ from 'lodash';

const ModalFriend = () => {
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const { userInfo } = useSelector(state => state.auth);
	const [getMyListFriend, setGetMyListFriend] = useState([]);

	const dispatch = useDispatch();

	const unFolow = id => {
		dispatch(unFollower(id)).unwrap();
		const newArrFriend = getMyListFriend.map(item => {
			if (item.userIdTwo === id) {
				return { ...item, checkUnfollow: true, checkFolow: false };
			}
			return { ...item };
		});
		setGetMyListFriend(newArrFriend);
	};

	const addFolow = id => {
		const param = {
			data: { userId: id },
		};

		dispatch(addFollower(param)).unwrap();
		const newArrFriend = getMyListFriend.map(item => {
			if (item.userIdTwo === id) {
				return { ...item, checkFolow: true, checkUnfollow: false };
			}
			return { ...item };
		});
		setGetMyListFriend(newArrFriend);
	};

	const handleUnFriend = id => {
		dispatch(unFriendRequest(id)).unwrap();
		const newArrFriend = getMyListFriend.map(item => {
			if (item.userIdTwo === id) {
				return { ...item, checkUnfriend: false };
			}
			return { ...item };
		});

		setGetMyListFriend(newArrFriend);
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
		try {
			if (!_.isEmpty(userInfo)) {
				const friendList = await dispatch(getFriendList(userInfo.id)).unwrap();
				const newArrFriend = friendList.rows.map(item => {
					return { ...item, checkFolow: false, checkUnfollow: false, checkUnfriend: true };
				});
				setGetMyListFriend(newArrFriend);
			}
		} catch {
			toast.error('Lỗi hệ thống');
		}
	}, [userInfo, dispatch]);

	return (
		<>
			<li
				onClick={() => {
					setModalOpen(true);
				}}
				className='personal-info__item'
			>
				<span className='number'>825</span>
				<span>Bạn bè (20 bạn chung)</span>
			</li>
			<Modal size='lg' className='modalFollowers__container__main' show={modalOpen} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Bạn bè của {userInfo.firstName} {userInfo.lastName}
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
							// <AuthorCard direction={'row'} key={item.id} size={'md'} item={item} />
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
										{/* <ConnectButtons direction={'row'} /> */}
										<div className={`connect-buttons ${'row'}`}>
											{renderButtonFollows(item)}

											<Button
												className='connect-button'
												isOutline={true}
												name='friend'
												onClick={() => handleUnFriend(item.userIdTwo)}
											>
												<Minus className='connect-button__icon' />

												{/* <Add className='connect-button__icon' /> */}

												<span className='connect-button__content'>Huỷ kết bạn</span>
											</Button>
										</div>
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
ModalFriend.propTypes = {};
export default ModalFriend;
