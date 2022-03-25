import { CloseX } from 'components/svg';
import SearchField from 'shared/search-field';
// import AuthorCard from 'shared/author-card';
// import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useModal } from 'shared/hooks';
import { getListFollowrs } from 'reducers/redux-utils/user';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import UserAvatar from 'shared/user-avatar';
import { Add } from 'components/svg';
import Button from 'shared/button';

const ModalWatching = () => {
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const { userInfo } = useSelector(state => state.auth);
	const [getListFollow, setGetListFollow] = useState([]);
	const dispatch = useDispatch();

	useEffect(async () => {
		try {
			if (!_.isEmpty(userInfo)) {
				const followList = await dispatch(getListFollowrs(userInfo.id)).unwrap();
				setGetListFollow(followList.rows);
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
				<span>Đang theo dõi</span>
			</li>
			<Modal size='lg' className='modalFollowers__container__main' show={modalOpen} onHide={toggleModal}>
				<Modal.Body className='modalFollowers__container'>
					<div className='modalFollowers__header'>
						<div className='modalFollowers__title'>
							Người {userInfo.firstName} {userInfo.lastName} đang theo dõi
						</div>
						<div className='modalFollowers__close'>
							<CloseX onClick={toggleModal} />
						</div>
					</div>
					<div className='modalFollowers__search'>
						<SearchField placeholder='Tìm kiếm trên Wisfeed' />
					</div>
					<div className='modalFollowers__info'>
						{getListFollow.map(item => (
							// <AuthorCard direction={'row'} key={item.id} size={'md'} item={item} />

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
										<Button className='connect-button follow'>
											<span className='connect-button__content'>Hủy theo dõi </span>
										</Button>

										<Button className='connect-button' isOutline={true} name='friend'>
											{/* <Minus className='connect-button__icon' /> */}

											<Add className='connect-button__icon' />
											<span className='connect-button__content'>Kết bạn</span>
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
ModalWatching.propTypes = {};
export default ModalWatching;
