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
import PropTypes from 'prop-types';
import backgroundImageDefault from 'assets/images/background-profile.png';
import { updateUserInfo } from 'reducers/redux-utils/auth';
import { useNavigate } from 'react-router-dom';

const PersonalInfo = ({ currentUserInfo, setCurrentTab }) => {
	const { ref: settingsRef, isVisible: isSettingsVisible, setIsVisible: setSettingsVisible } = useVisible(false);
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const [modalFriend, setModalFriend] = useState(false);
	const [modalFollower, setModalFollower] = useState(false);
	const [modalFollowing, setModalFollowing] = useState(false);
	const [bgImage, setBgImage] = useState('');
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		setModalOpen(false);
	}, [userInfo]);

	useEffect(() => {
		if (currentUserInfo.backgroundImage) {
			setBgImage(currentUserInfo.backgroundImage);
		} else {
			setBgImage(backgroundImageDefault);
		}
	}, [currentUserInfo]);

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
				const data = { userId: currentUserInfo.id, params: params };
				const changeUserImage = await dispatch(editUserInfo(data)).unwrap();
				dispatch(updateUserInfo(changeUserImage));
				if (!_.isEmpty(changeUserImage)) {
					const customId = 'custom-id-PersonalInfo-handleDrop-success';
					toast.success('Cập nhật ảnh thành công', { toastId: customId, autoClose: 1500 });
				}
			} catch (err) {
				if (err.statusCode === 413) {
					const customId = 'custom-id-PersonalInfo-handleDrop-warning';
					toast.warning('Không cập nhật được ảnh quá 1Mb', { toastId: customId });
				} else {
					const customId = 'custom-id-PersonalInfo-handleDrop-error';
					toast.error('Cập nhật ảnh thất bại', { toastId: customId });
				}
			}
		}
	});

	const onMouseEnterEdit = e => {
		e.target.style.cursor = 'pointer';
	};

	return (
		<div className='personal-info'>
			<div className='personal-info__wallpaper'>
				<img src={bgImage} alt='background-image' onError={() => setBgImage(backgroundImageDefault)} />
				<Dropzone onDrop={acceptedFile => handleDrop(acceptedFile, 'change-bgImage')}>
					{({ getRootProps, getInputProps }) => (
						<div className='edit-wallpaper' {...getRootProps()}>
							<input {...getInputProps()} />
							{currentUserInfo.id === userInfo.id && (
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
							source={currentUserInfo.avatarImage}
							className='personal-info__detail__avatar__user'
						/>
						<Dropzone onDrop={acceptedFile => handleDrop(acceptedFile, 'change-avatarImage')}>
							{({ getRootProps, getInputProps }) => (
								<div className='edit-avatar' {...getRootProps()}>
									<input {...getInputProps()} />
									{currentUserInfo.id === userInfo.id && (
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
							<h4>{currentUserInfo.fullName}</h4>
							{currentUserInfo.id === userInfo.id && (
								<div className='edit-name' onMouseEnter={onMouseEnterEdit} onClick={toggleModal}>
									<img className='edit-name__pencil' src={pencil} alt='pencil' />
									<button>Chỉnh sửa tên</button>
								</div>
							)}
							<div ref={settingsRef} className='setting'>
								<button className='setting-btn' onClick={handleSettings}>
									<img src={dots} alt='setting' />
								</button>
								{isSettingsVisible && (
									<ul className='setting-list'>
										{currentUserInfo.id === userInfo.id && (
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

										<li
											className='setting-item'
											onClick={() => {
												handleSettings();
												navigate(`/quotes/${currentUserInfo.id}`);
											}}
										>
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
						<div className='personal-info__email'>{currentUserInfo.email}</div>
					</div>
				</div>

				<div className='personal-info__detail__connect-buttons-and-introduction'>
					<div className={currentUserInfo.id !== userInfo.id ? 'personal-info' : 'personal-info-none'}>
						<ConnectButtons item={currentUserInfo} />
					</div>
					<div className='personal-info__detail__introduction'>
						<ul className='personal-info__list'>
							<li
								onClick={() => {
									setCurrentTab('post');
								}}
								className='personal-info__item'
							>
								<span className='number'>{currentUserInfo.posts}</span>
								<span>Bài viết</span>
							</li>
							<li
								onClick={() => {
									setModalFollower(true);
								}}
								className='personal-info__item'
							>
								<span className='number'>{currentUserInfo.follower}</span>
								<span>Người theo dõi</span>
							</li>

							{modalFollower && (
								<ModalFollowers
									setModalFollower={setModalFollower}
									modalFollower={modalFollower}
									userInfoDetail={currentUserInfo}
								/>
							)}
							<li
								onClick={() => {
									setModalFollowing(true);
								}}
								className='personal-info__item'
							>
								<span className='number'>{currentUserInfo.following}</span>
								<span>Đang theo dõi</span>
							</li>
							{modalFollowing && (
								<ModalWatching
									setModalFollowing={setModalFollowing}
									modalFollowing={modalFollowing}
									userInfoDetail={currentUserInfo}
								/>
							)}
							<li
								onClick={() => {
									setModalFriend(true);
								}}
								className='personal-info__item'
							>
								<span className='number'>{currentUserInfo.friends}</span>
								<span>
									Bạn bè
									{currentUserInfo.id !== userInfo.id ? (
										<span> ({currentUserInfo.mutualFriends})</span>
									) : null}
								</span>
							</li>
							{modalFriend && (
								<ModalFriend
									setModalFriend={setModalFriend}
									modalFriend={modalFriend}
									userInfoDetail={currentUserInfo}
								/>
							)}
						</ul>
						{currentUserInfo.descriptions && <ReadMore text={currentUserInfo.descriptions} />}
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
				<Modal.Body>
					<PersonalInfoForm userData={currentUserInfo} toggleModal={toggleModal} />
				</Modal.Body>
			</Modal>
		</div>
	);
};

PersonalInfo.propTypes = {
	currentUserInfo: PropTypes.object,
	setCurrentTab: PropTypes.func,
};

export default PersonalInfo;
