import camera from 'assets/images/camera.png';
import dots from 'assets/images/dots.png';
import pencil from 'assets/images/pencil.png';
import { Clock, CloseX, Pencil, QuoteIcon, Restrict } from 'components/svg';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import ConnectButtons from 'shared/connect-buttons';
import { useModal, useVisible } from 'shared/hooks';
import ReadMore from 'shared/read-more';
import UserAvatar from 'shared/user-avatar';
import PersonalInfoForm from './personal-info-form/PersonalInfoForm';
import './personal-info.scss';
import ModalFollowers from './modal-followers';
import ModalWatching from './modal-watching';
import ModalFriend from './modal-friend';
import { useSelector, useDispatch } from 'react-redux';
import { uploadImage } from 'reducers/redux-utils/common';
import _ from 'lodash';
import { editUserInfo } from 'reducers/redux-utils/user';
import { toast } from 'react-toastify';
import { activeUpdateUserProfileStatus } from 'reducers/redux-utils/user';
import PropTypes from 'prop-types';
import backgroundImageDefault from 'assets/images/background-profile.png';

const PersonalInfo = ({ userInfos }) => {
	const { ref: settingsRef, isVisible: isSettingsVisible, setIsVisible: setSettingsVisible } = useVisible(false);
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const [modalFriend, setModalFriend] = useState(false);
	const [modalFollower, setModalFollower] = useState(false);
	const [modalFollowing, setModalFollowing] = useState(false);
	const [bgImage, setBgImage] = useState('');
	const { userInfo } = useSelector(state => state.auth);
	const updateUserProfile = useSelector(state => state.user.updateUserProfile);
	const dispatch = useDispatch();
	useEffect(() => {
		setModalOpen(false);
	}, [updateUserProfile, userInfo]);

	useEffect(() => {
		if (userInfos.backgroundImage) {
			setBgImage(userInfos.backgroundImage);
		}
	}, [userInfos]);

	const handleSettings = () => {
		setSettingsVisible(prev => !prev);
	};

	const handleDrop = useCallback(async (acceptedFile, option) => {
		if (!_.isEmpty(acceptedFile)) {
			try {
				const imageUploadedData = await dispatch(uploadImage(acceptedFile)).unwrap();
				let params;
				if (option === 'change-bgImage') {
					params = { backgroundImage: imageUploadedData.streamPath };
				} else {
					params = { avatarImage: imageUploadedData.streamPath };
				}
				const data = { userId: userInfos.id, params: params };
				const changeUserImage = await dispatch(editUserInfo(data)).unwrap();
				if (!_.isEmpty(changeUserImage)) {
					toast.success('Cập nhật ảnh thành công', { autoClose: 1500 });
					dispatch(activeUpdateUserProfileStatus());
				}
			} catch {
				toast.error('Cập nhật ảnh thất bại');
			}
		}
	});

	return (
		<div className='personal-info'>
			<div className='personal-info__wallpaper'>
				{userInfos.backgroundImage ? (
					<img src={bgImage} alt='background-image' onError={() => setBgImage(backgroundImageDefault)} />
				) : (
					<img src={backgroundImageDefault} alt='background-image' />
				)}

				<Dropzone onDrop={acceptedFile => handleDrop(acceptedFile, 'change-bgImage')}>
					{({ getRootProps, getInputProps }) => (
						<div className='edit-wallpaper' {...getRootProps()}>
							<input {...getInputProps()} />
							{userInfos.id === userInfo.id && (
								<button className='edit-wallpaper__btn'>
									<img src={camera} alt='camera' />
									<span>Chỉnh sửa ảnh bìa</span>
								</button>
							)}
						</div>
					)}
				</Dropzone>
			</div>
			<div className='personal-info__detail'>
				<div className='personal-info__detail__avatar-and-name'>
					<div className='personal-info__detail__avatar'>
						<UserAvatar
							size='xl'
							source={userInfos.avatarImage}
							className='personal-info__detail__avatar__user'
						/>
						<Dropzone onDrop={acceptedFile => handleDrop(acceptedFile, 'change-avatarImage')}>
							{({ getRootProps, getInputProps }) => (
								<div className='edit-avatar' {...getRootProps()}>
									<input {...getInputProps()} />
									{userInfos.id === userInfo.id && (
										<button className='edit-avatar__btn'>
											<img src={camera} alt='camera' />
										</button>
									)}
								</div>
							)}
						</Dropzone>
					</div>
					<div className='personal-info__detail__name'>
						<div className='personal-info__username'>
							<h4>{userInfos.fullName}</h4>
							{userInfos.id === userInfo.id && (
								<div className='edit-name'>
									<img className='edit-name__pencil' src={pencil} alt='pencil' />
									<button onClick={toggleModal}>Chỉnh sửa tên</button>
								</div>
							)}
							<div ref={settingsRef} className='setting'>
								<button className='setting-btn' onClick={handleSettings}>
									<img src={dots} alt='setting' />
								</button>
								{isSettingsVisible && (
									<ul className='setting-list'>
										{userInfos.id === userInfo.id && (
											<li
												className='setting-item'
												onClick={() => {
													handleSettings();
													setModalOpen(true);
												}}
											>
												<Pencil />
												<span className='setting-item__content'>
													Chỉnh sửa thông tin cá nhân
												</span>
											</li>
										)}

										<li className='setting-item' onClick={handleSettings}>
											<QuoteIcon />
											<span className='setting-item__content'>Quotes</span>
										</li>
										<li className='setting-item' onClick={handleSettings}>
											<Clock />
											<span className='setting-item__content'>Lịch sử đọc</span>
										</li>
										<li className='setting-item' onClick={handleSettings}>
											<Restrict />
											<span className='setting-item__content'>Chặn</span>
										</li>
									</ul>
								)}
							</div>
						</div>
						<div className='personal-info__email'>{userInfos.email}</div>
					</div>
				</div>

				<div className='personal-info__detail__connect-buttons-and-introduction'>
					<div className={userInfos.id === userInfo.id && 'personal-info-none'}>
						{' '}
						<ConnectButtons />
					</div>
					<div className='personal-info__detail__introduction'>
						<ul className='personal-info__list'>
							<li className='personal-info__item'>
								<span className='number'>{userInfos.posts}</span>
								<span>Bài viết</span>
							</li>
							<li
								onClick={() => {
									setModalFollower(true);
								}}
								className='personal-info__item'
							>
								<span className='number'>{userInfos.follower}</span>
								<span>Người theo dõi</span>
							</li>

							{modalFollower && (
								<ModalFollowers
									setModalFollower={setModalFollower}
									modalFollower={modalFollower}
									userInfoDetail={userInfos}
								/>
							)}
							<li
								onClick={() => {
									setModalFollowing(true);
								}}
								className='personal-info__item'
							>
								<span className='number'>{userInfos.following}</span>
								<span>Đang theo dõi</span>
							</li>
							{modalFollowing && (
								<ModalWatching
									setModalFollowing={setModalFollowing}
									modalFollowing={modalFollowing}
									userInfoDetail={userInfos}
								/>
							)}
							<li
								onClick={() => {
									setModalFriend(true);
								}}
								className='personal-info__item'
							>
								<span className='number'>{userInfos.friends}</span>
								<span>Bạn bè ({userInfos.mutualFriends})</span>
							</li>
							{modalFriend && (
								<ModalFriend
									setModalFriend={setModalFriend}
									modalFriend={modalFriend}
									userInfoDetail={userInfos}
								/>
							)}
						</ul>
						{userInfos.descriptions && <ReadMore text={userInfos.descriptions} />}
					</div>
				</div>
			</div>

			<Modal className='personal-info__modal' show={modalOpen} onHide={toggleModal}>
				<Modal.Header>
					<h4 className='modal-title'>Chỉnh sửa thông tin cá nhân</h4>
					<button className='close-btn' onClick={toggleModal}>
						<CloseX />
					</button>
				</Modal.Header>
				<Modal.Body className='personal-info__modal__body'>
					<PersonalInfoForm userData={userInfos} />
				</Modal.Body>
			</Modal>
		</div>
	);
};

PersonalInfo.propTypes = {
	userInfos: PropTypes.object,
};

export default PersonalInfo;
