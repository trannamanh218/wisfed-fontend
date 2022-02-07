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

function CreatPostModalContent({ hideCreatPostModal }) {
	const [shareMode, setShareMode] = useState('public');
	const [show, setShow] = useState(false);
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);

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

	return (
		<div className='creat-post-modal-content'>
			<div className='creat-post-modal-content__main'>
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
					<div className='creat-post-modal-content__main__body__text-field-box'>
						<div className='creat-post-modal-content__main__body__text-field-edit-wrapper'>
							<div
								className='creat-post-modal-content__main__body__text-field-edit'
								contentEditable={true}
								ref={textFieldEdit}
							></div>
						</div>
						<div
							className={classNames('creat-post-modal-content__main__body__text-field-placeholder', {
								'hide': !showTextFieldEditPlaceholder,
							})}
						>
							Hãy chia sẻ cảm nhận của bạn về cuốn sách
						</div>
					</div>
				</div>
				<div className='creat-post-modal-content__main__options-and-submit'>
					<div className='creat-post-modal-content__main__options'>
						<span>Thêm vào bài viết</span>
						<div className='creat-post-modal-content__main__options__items'>
							<button className='creat-post-modal-content__main__options__item-add-to-post'>
								<BookIcon />
							</button>
							<button className='creat-post-modal-content__main__options__item-add-to-post'>
								<Feather className='item-add-to-post-svg' />
							</button>
							<button className='creat-post-modal-content__main__options__item-add-to-post'>
								<CategoryIcon className='item-add-to-post-svg' />
							</button>
							<button className='creat-post-modal-content__main__options__item-add-to-post'>
								<Image />
							</button>
							<button className='creat-post-modal-content__main__options__item-add-to-post'>
								<TwoDots />
							</button>
						</div>
					</div>
					<button className='creat-post-modal-content__main__submit'>Đăng</button>
				</div>
			</div>
		</div>
	);
}

CreatPostModalContent.propTypes = {
	hideCreatPostModal: PropTypes.func,
};

export default CreatPostModalContent;
