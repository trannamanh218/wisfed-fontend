import { useEffect, useState, useRef } from 'react';
import { BookIcon, Feather, CategoryIcon, GroupIcon } from 'components/svg';
import CreatePostModalContent from '../create-post-modal-content';
import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { updateCurrentBook } from 'reducers/redux-utils/book';
import { saveDataShare } from 'reducers/redux-utils/post';
import { useLocation } from 'react-router-dom';
import { handleSetImageToShare } from 'reducers/redux-utils/chart';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { handleClickCreateNewPostForBook } from 'reducers/redux-utils/activity';
import DirectLinkALertModal from 'shared/direct-link-alert-modal';

function CreatePost({ onChangeNewPost }) {
	const [showModalCreatPost, setShowModalCreatPost] = useState(false);
	const [option, setOption] = useState({});
	const [showSubModal, setShowSubModal] = useState(false);
	const createPostModalContainer = useRef(null);
	const scrollBlocked = useRef(false);
	const location = useLocation();
	const [modalShow, setModalShow] = useState(false);

	const { postDataShare } = useSelector(state => state.post);
	const { imageToShareData } = useSelector(state => state.chart);
	const isWarning = useSelector(state => state.post.isWarning);

	const message = 'Bạn đang có bài viết chưa hoàn thành. Bạn có chắc muốn rời khỏi khi chưa đăng không?';

	const {
		auth: { userInfo },
		book: { bookForCreatePost },
	} = useSelector(state => state);

	const dispatch = useDispatch();

	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
	const html = safeDocument.documentElement;
	let optionList = null;

	if (location.pathname.includes('group')) {
		optionList = [
			{
				value: 'addBook',
				title: 'Sách',
				icon: <BookIcon className='newfeed__create-post__options__item__logo--book' />,
				message: 'Không tìm thấy cuốn sách nào',
			},
			{
				value: 'addAuthor',
				title: 'Tác giả',
				icon: <Feather className='item-add-to-post-svg' />,
				message: 'Không tìm thấy tác giả',
			},
			{
				value: 'addCategory',
				title: 'Chủ đề',
				icon: <CategoryIcon className='newfeed__create-post__options__item__logo--category' />,
				message: 'Không tìm thấy chủ đề',
			},
		];
	} else {
		optionList = [
			{
				value: 'addBook',
				title: 'Sách',
				icon: <BookIcon className='newfeed__create-post__options__item__logo--book' />,
				message: 'Không tìm thấy cuốn sách nào',
			},
			{
				value: 'addAuthor',
				title: 'Tác giả',
				icon: <Feather className='item-add-to-post-svg' />,
				message: 'Không tìm thấy tác giả',
			},
			{
				value: 'addCategory',
				title: 'Chủ đề',
				icon: <CategoryIcon className='newfeed__create-post__options__item__logo--category' />,
				message: 'Không tìm thấy chủ đề',
			},
			{
				value: 'addFriends',
				title: 'Bạn bè',
				icon: <GroupIcon className='newfeed__create-post__options__item__logo--friend' />,
				message: 'Không tìm thấy bạn bè',
			},
		];
	}

	useEffect(() => {
		if (!_.isEmpty(bookForCreatePost) || !_.isEmpty(postDataShare) || !_.isEmpty(imageToShareData)) {
			setShowModalCreatPost(true);
		}
	}, [bookForCreatePost, postDataShare, imageToShareData]);

	const handleHideCreatePost = e => {
		if (e.target === createPostModalContainer.current) {
			if (isWarning) {
				setModalShow(true);
			} else {
				hideCreatePostModal();
			}
		}
	};

	useEffect(() => {
		if (modalShow) {
			const modalBackground = document.querySelector('.modal-backdrop');
			modalBackground.style.backgroundColor = 'initial';
		}
	}, [modalShow]);

	useEffect(() => {
		if (showModalCreatPost) {
			createPostModalContainer.current.addEventListener('mousedown', handleHideCreatePost);
			blockScroll();
		} else {
			allowScroll();
		}
		return () => {
			if (createPostModalContainer.current) {
				createPostModalContainer.current.removeEventListener('mousedown', handleHideCreatePost);
			}
		};
	}, [showModalCreatPost, isWarning]);

	const blockScroll = () => {
		if (!body || !body.style || scrollBlocked.current) return;
		const scrollBarWidth = window.innerWidth - html.clientWidth;
		const bodyPaddingRight = parseInt(window.getComputedStyle(body).getPropertyValue('padding-right')) || 0;
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

	const hideCreatePostModal = () => {
		dispatch(saveDataShare({}));
		dispatch(handleSetImageToShare([]));
		dispatch(updateCurrentBook({}));
		dispatch(handleClickCreateNewPostForBook(false));
		setOption({});
		setShowModalCreatPost(false);
		setShowSubModal(false);
	};

	const onChangeOption = data => {
		setOption(data);
	};

	const handleCheck = item => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (item.value === 'addBook') {
				dispatch(handleClickCreateNewPostForBook(true));
			}
			onChangeOption(item);
			setShowModalCreatPost(true);
			setShowSubModal(true);
		}
	};

	const renderOptionList = () => {
		return optionList.map(item => (
			<div className='newfeed__create-post__options__item' key={item.title} onClick={() => handleCheck(item)}>
				<div className='newfeed__create-post__options__item__logo'>{item.icon}</div>
				<span className='text-'>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</span>
			</div>
		));
	};

	const handleUserLogin = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			setShowModalCreatPost(true);
		}
	};

	const handleAccept = () => {
		setModalShow(false);
		hideCreatePostModal();
	};

	const handleCancel = () => {
		setModalShow(false);
	};

	return (
		<div className='newfeed__create-post'>
			<div className='newfeed__create-post__avatar-and-input'>
				<UserAvatar className='newfeed__create-post__avatar' source={userInfo?.avatarImage} />
				<input
					className='newfeed__create-post__input'
					placeholder='Tạo bài viết của bạn ...'
					onClick={() => {
						handleUserLogin();
					}}
					readOnly
				/>
			</div>
			<div
				className='newfeed__create-post__options'
				onClick={() => {
					handleUserLogin();
				}}
			>
				{renderOptionList()}
			</div>
			{showModalCreatPost && (
				<div className='newfeed__create-post__modal' ref={createPostModalContainer}>
					<CreatePostModalContent
						hideCreatePostModal={hideCreatePostModal}
						showModalCreatPost={showModalCreatPost}
						option={option}
						onChangeOption={onChangeOption}
						onChangeNewPost={onChangeNewPost}
						setShowModalCreatPost={setShowModalCreatPost}
						showSubModal={showSubModal}
						bookForCreatePost={bookForCreatePost}
						message={message}
					/>
					<DirectLinkALertModal
						className={'creat-post-modal-content__modal-confirm'}
						modalShow={modalShow}
						handleAccept={handleAccept}
						handleCancel={handleCancel}
						message={message}
						yesBtnMsg={'Có'}
						noBtnMsg={'Không'}
						centered={false}
					/>
				</div>
			)}
		</div>
	);
}

CreatePost.propTypes = {
	onChangeNewPost: PropTypes.func,
};

export default CreatePost;
