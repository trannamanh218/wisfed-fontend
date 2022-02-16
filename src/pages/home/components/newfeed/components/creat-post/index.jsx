import { useEffect, useState, useRef } from 'react';
import { BookIcon, Hashtag, Feather, CategoryIcon } from 'components/svg';
import avatar from 'assets/images/avatar.png';
import CreatPostModalContent from '../creat-post-modal-content';

function CreatPost() {
	const [showModalCreatPost, setShowModalCreatPost] = useState(false);

	const creatPostModalContainer = useRef(null);
	const scrollBlocked = useRef(false);

	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
	const html = safeDocument.documentElement;

	useEffect(() => {
		if (showModalCreatPost) {
			creatPostModalContainer.current.addEventListener('mousedown', e => {
				if (e.target === creatPostModalContainer.current) {
					setShowModalCreatPost(false);
				}
			});
			blockScroll();
		} else {
			allowScroll();
		}
	}, [showModalCreatPost]);

	const blockScroll = () => {
		if (!body || !body.style || scrollBlocked.current) return;

		const scrollBarWidth = window.innerWidth - html.clientWidth;
		const bodyPaddingRight = parseInt(window.getComputedStyle(body).getPropertyValue('padding-right')) || 0;
		html.style.position = 'relative';
		html.style.overflow = 'hidden';
		body.style.position = 'relative';
		body.style.overflow = 'hidden';
		body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;

		scrollBlocked.current = true;
	};

	const allowScroll = () => {
		if (!body || !body.style || !scrollBlocked.current) return;

		html.style.position = '';
		html.style.overflow = '';
		body.style.position = '';
		body.style.overflow = '';
		body.style.paddingRight = '';

		scrollBlocked.current = false;
	};

	const hideCreatPostModal = () => {
		setShowModalCreatPost(false);
	};

	return (
		<div className='newfeed__creat-post'>
			{!showModalCreatPost ? (
				<>
					<div className='newfeed__creat-post__avatar-and-input'>
						<div className='newfeed__creat-post__avatar'>
							<img data-testid='creat-post__user-avatar' src={avatar} alt='' />
						</div>
						<input
							className='newfeed__creat-post__input'
							placeholder='Tạo bài viết của bạn ...'
							onClick={() => setShowModalCreatPost(true)}
						/>
					</div>
					<div className='newfeed__creat-post__options'>
						<div className='newfeed__creat-post__options__item'>
							<div className='newfeed__creat-post__options__item__logo'>
								<BookIcon className='newfeed__creat-post__options__item__logo--book' />
							</div>
							<span>Sách</span>
						</div>
						<div className='newfeed__creat-post__options__item'>
							<div className='newfeed__creat-post__options__item__logo'>
								<Feather />
							</div>
							<span>Tác giả</span>
						</div>
						<div className='newfeed__creat-post__options__item'>
							<div className='newfeed__creat-post__options__item__logo'>
								<CategoryIcon className='newfeed__creat-post__options__item__logo--category' />
							</div>
							<span>Chủ đề</span>
						</div>
						<div className='newfeed__creat-post__options__item'>
							<div className='newfeed__creat-post__options__item__logo'>
								<Hashtag className='newfeed__creat-post__options__item__logo--hashtag' />
							</div>
							<span>Hashtag</span>
						</div>
					</div>
				</>
			) : (
				<div className='newfeed__creat-post__modal' ref={creatPostModalContainer}>
					<CreatPostModalContent hideCreatPostModal={hideCreatPostModal} />
				</div>
			)}
		</div>
	);
}

export default CreatPost;
