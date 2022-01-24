import './style.scss';
import { CloseX, WorldNet, GroupIcon, PodCast, Lock } from 'components/svg';
import { useState } from 'react';
import classNames from 'classnames';

function CreatPostModalContent() {
	const [shareMode, setShareMode] = useState('public');
	const [show, setShow] = useState(false);

	const renderShareModeSelected = () => {
		switch (shareMode) {
			case 'public':
				return (
					<div className='creat-post-modal-content__main__body__user-info__share-mode__selected'>
						<WorldNet />
						<span>Mọi người</span>
					</div>
				);
			case 'friends':
				return (
					<div className='creat-post-modal-content__main__body__user-info__share-mode__selected'>
						<GroupIcon />
						<span>Bạn bè</span>
					</div>
				);
			case 'followers':
				return (
					<div className='creat-post-modal-content__main__body__user-info__share-mode__selected'>
						<PodCast />
						<span>Người Follow</span>
					</div>
				);
			case 'private':
				return (
					<div className='creat-post-modal-content__main__body__user-info__share-mode__selected'>
						<Lock />
						<span>Chỉ mình tôi</span>
					</div>
				);
		}
	};
	return (
		<div className='creat-post-modal-content'>
			<div className='creat-post-modal-content__main'>
				<div className='creat-post-modal-content__main__header'>
					<h5>Tạo bài viết</h5>
					<button>
						<CloseX />
					</button>
				</div>
				<div className='creat-post-modal-content__main__body'>
					<div className='creat-post-modal-content__main__body__user-info'>
						<div className='creat-post-modal-content__main__body__user-info__block-left'>
							<img src='' alt='' />
						</div>
						<div className='creat-post-modal-content__main__body__user-info__block-right'>
							<p>abc</p>
							<div
								className='creat-post-modal-content__main__body__user-info__share-mode'
								onClick={() => setShow(!show)}
							>
								{renderShareModeSelected()}
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
										className='creat-post-modal-content__main__body__user-info__share-mode__selected'
										onClick={() => setShareMode('public')}
									>
										<WorldNet />
										<span>Mọi người</span>
									</div>
									<div
										className='creat-post-modal-content__main__body__user-info__share-mode__selected'
										onClick={() => setShareMode('friends')}
									>
										<GroupIcon />
										<span>Bạn bè</span>
									</div>
									<div className='creat-post-modal-content__main__body__user-info__share-mode__selected'>
										<PodCast />
										<span>Người Follow</span>
									</div>
									<div className='creat-post-modal-content__main__body__user-info__share-mode__selected'>
										<Lock />
										<span>Chỉ mình tôi</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='creat-post-modal-content__option'></div>
		</div>
	);
}

export default CreatPostModalContent;
