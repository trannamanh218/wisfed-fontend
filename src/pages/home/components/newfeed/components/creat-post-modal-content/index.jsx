import './style.scss';
import {
	CloseX,
	WorldNet,
	GroupIcon,
	PodCast,
	Lock,
	BookIcon,
	CategoryIcon,
	Feather,
	Image,
	TwoDots,
} from 'components/svg';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import avatar from 'assets/images/avatar.png';
import PropTypes from 'prop-types';
import CreatPostSubModal from './sub-modal';
function CreatPostModalContent({ hideCreatPostModal }) {
	const [shareMode, setShareMode] = useState('public');
	const [show, setShow] = useState(false);
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);
	const [showMainModal, setShowMainModal] = useState(true);
	const [option, setOption] = useState('');
	const [images, setImages] = useState([]);

	const textFieldEdit = useRef(null);

	useEffect(() => {
		textFieldEdit.current.focus();
	}, []);

	useEffect(() => {
		textFieldEdit.current.addEventListener('input', () => {
			if (textFieldEdit.current.innerText.length > 0) {
				setShowTextFieldEditPlaceholder(false);
			} else {
				setShowTextFieldEditPlaceholder(true);
			}
		});
	}, [showTextFieldEditPlaceholder]);

	const renderShareModeSelected = () => {
		switch (shareMode) {
			case 'public':
				return (
					<>
						<WorldNet />
						<span>Mọi người</span>
					</>
				);
			case 'friends':
				return (
					<>
						<GroupIcon className='group-icon-svg' />
						<span>Bạn bè</span>
					</>
				);
			case 'followers':
				return (
					<>
						<PodCast />
						<span>Người Follow</span>
					</>
				);
			case 'private':
				return (
					<>
						<Lock />
						<span>Chỉ mình tôi</span>
					</>
				);
		}
	};

	const backToMainModal = () => {
		setShowMainModal(true);
	};

	const addOptionsToPost = param => {
		setOption(param);
		setShowMainModal(false);
	};

	const onChangeImages = e => {
		const obj = Object.entries(e.target.files);
		let newArrayFile = [...images];
		obj.forEach(item => newArrayFile.push(item[1]));
		setImages(newArrayFile);
	};

	useEffect(() => {
		if (images.length === 1) {
			document.querySelector('.img-0').style.inset = '0%';
		} else if (images.length === 2) {
			document.querySelector('.img-0').style.inset = '0% 0% 50% 0%';
			document.querySelector('.img-1').style.inset = '50% 0% 0% 0%';
		} else if (images.length === 3) {
			document.querySelector('.img-0').style.inset = '0% 0% 33.335% 0%';
			document.querySelector('.img-1').style.inset = '66.67% 50% 0% 0%';
			document.querySelector('.img-2').style.inset = '66.67% 0% 0% 50%';
		} else if (images.length === 4) {
			document.querySelector('.img-0').style.inset = '0% 0% 33.335% 0%';
			document.querySelector('.img-1').style.inset = '66.67% 66.67% 0% 0%';
			document.querySelector('.img-2').style.inset = '66.67% 33.335% 0% 33.335%';
			document.querySelector('.img-3').style.inset = '66.67% 0% 0% 66.67%';
		} else if (images.length > 4) {
			document.querySelector('.img-0').style.inset = '0% 50% 50% 0%';
			document.querySelector('.img-1').style.inset = '50% 50% 0% 0%';
			document.querySelector('.img-2').style.inset = '0% 0% 66.67% 50%';
			document.querySelector('.img-3').style.inset = '33.335% 0% 33.335% 50%';
			document.querySelector('.img-4').style.inset = '66.67% 0% 0% 50%';
		}
	}, [images]);

	return (
		<div className='creat-post-modal-content'>
			{/* main modal */}
			<div className={classNames('creat-post-modal-content__main', { 'hide': !showMainModal })}>
				<div className='creat-post-modal-content__main__header'>
					<div style={{ visibility: 'hidden' }} className='creat-post-modal-content__main__close'>
						<CloseX />
					</div>
					<h5>Tạo bài viết</h5>
					<button className='creat-post-modal-content__main__close' onClick={hideCreatPostModal}>
						<CloseX />
					</button>
				</div>
				<div className='creat-post-modal-content__main__body'>
					<div className='creat-post-modal-content__main__body__user-info'>
						<div className='creat-post-modal-content__main__body__user-info__block-left'>
							<img src={avatar} alt='' />
						</div>
						<div className='creat-post-modal-content__main__body__user-info__block-right'>
							<p>Trần Thị Hoa</p>
							<div className='creat-post-modal-content__main__body__user-info__share-mode-container'>
								<div
									className={classNames(
										'creat-post-modal-content__main__body__user-info__share-mode',
										{
											'show': show,
											'hide': !show,
										}
									)}
									onClick={() => setShow(!show)}
								>
									<div className='creat-post-modal-content__main__body__user-info__share-mode__selected'>
										{renderShareModeSelected()}
										<div>
											<i className='fas fa-caret-down'></i>
										</div>
									</div>
									<div
										className={classNames(
											'creat-post-modal-content__main__body__user-info__share-mode__list',
											{
												'show': show,
												'hide': !show,
											}
										)}
									>
										<div
											className={classNames(
												'creat-post-modal-content__main__body__user-info__share-mode__select-item',
												{ 'show': shareMode !== 'public', 'hide': shareMode === 'public' }
											)}
											onClick={() => setShareMode('public')}
										>
											<WorldNet />
											<span>Mọi người</span>
										</div>
										<div
											className={classNames(
												'creat-post-modal-content__main__body__user-info__share-mode__select-item',
												{ 'show': shareMode !== 'friends', 'hide': shareMode === 'friends' }
											)}
											onClick={() => setShareMode('friends')}
										>
											<GroupIcon className='group-icon-svg' />
											<span>Bạn bè</span>
										</div>
										<div
											className={classNames(
												'creat-post-modal-content__main__body__user-info__share-mode__select-item',
												{ 'show': shareMode !== 'followers', 'hide': shareMode === 'followers' }
											)}
											onClick={() => setShareMode('followers')}
										>
											<PodCast />
											<span>Người Follow</span>
										</div>
										<div
											className={classNames(
												'creat-post-modal-content__main__body__user-info__share-mode__select-item',
												{ 'show': shareMode !== 'private', 'hide': shareMode === 'private' }
											)}
											onClick={() => setShareMode('private')}
										>
											<Lock />
											<span>Chỉ mình tôi</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='creat-post-modal-content__main__body__text-field-edit-wrapper'>
						<div
							className='creat-post-modal-content__main__body__text-field-edit'
							contentEditable={true}
							ref={textFieldEdit}
						></div>
						<div
							className={classNames('creat-post-modal-content__main__body__text-field-placeholder', {
								'hide': !showTextFieldEditPlaceholder,
							})}
						>
							Hãy chia sẻ cảm nhận của bạn về cuốn sách
						</div>
						<div
							className={classNames('creat-post-modal-content__main__body__image-container', {
								'one-image': images.length === 1,
								'more-one-image': images.length > 1,
							})}
						>
							<div className='creat-post-modal-content__main__body__image-box'>
								{images.length > 0 &&
									images.map((image, index) => (
										<div
											key={index}
											className={`creat-post-modal-content__main__body__image img-${index}`}
										>
											<img src={URL.createObjectURL(image)} alt='image' />
										</div>
									))}
							</div>
						</div>
					</div>
				</div>
				<div className='creat-post-modal-content__main__options-and-submit'>
					<div className='creat-post-modal-content__main__options'>
						<span>Thêm vào bài viết</span>
						<div className='creat-post-modal-content__main__options__items'>
							<button
								className='creat-post-modal-content__main__options__item-add-to-post'
								onClick={() => addOptionsToPost('add-book')}
							>
								<BookIcon />
							</button>
							<button
								className='creat-post-modal-content__main__options__item-add-to-post'
								onClick={() => addOptionsToPost('add-author')}
							>
								<Feather className='item-add-to-post-svg' />
							</button>
							<button
								className='creat-post-modal-content__main__options__item-add-to-post'
								onClick={() => addOptionsToPost('add-topic')}
							>
								<CategoryIcon className='item-add-to-post-svg' />
							</button>
							<button
								className='creat-post-modal-content__main__options__item-add-to-post'
								onClick={() => addOptionsToPost('add-friends')}
							>
								<GroupIcon className='item-add-to-post-svg' />
							</button>
							<label
								htmlFor='image-upload'
								className='creat-post-modal-content__main__options__item-add-to-post'
							>
								<Image />
							</label>
							<input
								id='image-upload'
								type='file'
								onChange={onChangeImages}
								accept='image/png, image/gif, image/jpeg'
								multiple
							/>

							<button className='creat-post-modal-content__main__options__item-add-to-post'>
								<TwoDots />
							</button>
						</div>
					</div>
					<button className='creat-post-modal-content__main__submit'>Đăng</button>
				</div>
			</div>
			{/* sub modal */}
			<div className={classNames('creat-post-modal-content__substitute', { 'show': !showMainModal })}>
				<CreatPostSubModal option={option} backToMainModal={backToMainModal} />
			</div>
		</div>
	);
}

CreatPostModalContent.propTypes = {
	hideCreatPostModal: PropTypes.func,
};

export default CreatPostModalContent;
