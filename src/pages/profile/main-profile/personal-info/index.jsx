import avatar from 'assets/images/avatar2.png';
import background from 'assets/images/background-profile.png';
import camera from 'assets/images/camera.png';
import dots from 'assets/images/dots.png';
import pencil from 'assets/images/pencil.png';
import { Clock, CloseX, Pencil, QuoteIcon, Restrict } from 'components/svg';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import ConnectButtons from 'shared/connect-buttons';
import { useModal, useVisible } from 'shared/hooks';
import ReadMore from 'shared/read-more';
import UserAvatar from 'shared/user-avatar';
import PersonalInfoForm from './PersonalInfoForm';
import './personal-info.scss';
import ModalFollowers from './modal-followers';

const PersonalInfo = () => {
	const { ref: settingsRef, isVisible: isSettingsVisible, setIsVisible: setSettingsVisible } = useVisible(false);
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const [idModalItem, setIdModalItem] = useState('');
	const [modalFollowers, setModalFollowers] = useState(false);
	const [modalWatching, setModalWatching] = useState(false);
	const handleSettings = () => {
		setSettingsVisible(prev => !prev);
	};

	const handleDrop = () => {};
	const handleModalFollowwers = name => {
		if (name === 'followers') {
			setModalFollowers(true);
		} else {
			setModalWatching(true);
		}
		setIdModalItem(name);
	};
	return (
		<div className='personal-info'>
			<div className='personal-info__wallpaper' style={{ backgroundImage: `url(${background})` }}>
				<Dropzone onDrop={handleDrop}>
					{({ getRootProps, getInputProps }) => (
						<div className='edit-wallpaper' {...getRootProps()}>
							<input {...getInputProps()} />
							<button className='edit-wallpaper__btn'>
								<img src={camera} alt='camera' />
								<span>Chỉnh sửa bài viết</span>
							</button>
						</div>
					)}
				</Dropzone>
			</div>
			<div className='personal-info__detail'>
				<div className='personal-info__detail__left'>
					<div className='personal-info__detail__avatar'>
						<UserAvatar size='xl' source={avatar} className='personal-info__detail__avatar__user' />
						<Dropzone onDrop={handleDrop}>
							{({ getRootProps, getInputProps }) => (
								<div className='edit-avatar' {...getRootProps()}>
									<input {...getInputProps()} />
									<button className='edit-avatar__btn'>
										<img src={camera} alt='camera' />
									</button>
								</div>
							)}
						</Dropzone>
					</div>
					<ConnectButtons />
				</div>
				<div className='personal-info__detail__right'>
					<div className='personal-info__username'>
						<h4>Phuong Anh nguyen</h4>
						<div className='edit-name'>
							<img className='edit-name__pencil' src={pencil} alt='pencil' />
							<span>Chỉnh sửa tên</span>
						</div>
						<div ref={settingsRef} className='setting'>
							<button className='setting-btn' onClick={handleSettings}>
								<img src={dots} alt='setting' />
							</button>
							{isSettingsVisible && (
								<ul className='setting-list'>
									<li
										className='setting-item'
										onClick={() => {
											handleSettings();
											setModalOpen(true);
										}}
									>
										<Pencil />
										<span className='setting-item__content'>Chỉnh sửa thông tin cá nhân</span>
									</li>
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
					<span>@phuonganfa-flip-horizontal</span>
					<ul className='personal-info__list'>
						<li className='personal-info__item'>
							<span className='number'>825</span>
							<span>Bài viết</span>
						</li>
						<li onClick={() => handleModalFollowwers('followers')} className='personal-info__item'>
							<span className='number'>825</span>
							<span>Người theo dõi</span>
							{modalFollowers && (
								<ModalFollowers idModalItem={idModalItem} setModalWatching={setModalFollowers} />
							)}
						</li>
						<li onClick={() => handleModalFollowwers('watching')} className='personal-info__item'>
							<span className='number'>825</span>
							<span>Đang theo dõi</span>
							{modalWatching && (
								<ModalFollowers idModalItem={idModalItem} setModalWatching={setModalWatching} />
							)}
						</li>
						<li className='personal-info__item'>
							<span className='number'>825</span>
							<span>Bạn bè (20 bạn chung)</span>
						</li>
					</ul>
					<ReadMore
						text={`	When literature student Anastasia Steele goes to house of interview young entrepreneur Christian
						Grey, she is encounters a man who is beautiful, brilliant, and only one intimidating. The
						unworldly housing When literature student Anastasia Steele goes to house of interview young
						entrepreneur Christian Grey, she is encounters a man who is beautiful, brilliant, and only one
						en literature student Anastasia Steele goes to house of
						interview young entrepreneur Christian Grey, she is encounters a man who is beautiful,
						brilliant, and only one intimidating.
					`}
					/>
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
					<PersonalInfoForm />
				</Modal.Body>
			</Modal>
		</div>
	);
};

PersonalInfo.propTypes = {};

export default PersonalInfo;
