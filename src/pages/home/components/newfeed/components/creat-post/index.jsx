import { useEffect, useState, useRef } from 'react';
import { BookIcon, Feather, CategoryIcon, GroupIcon, Hashtag } from 'components/svg';
import CreatPostModalContent from '../creat-post-modal-content';
import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { updateCurrentBook } from 'reducers/redux-utils/book';
import { useLocation } from 'react-router-dom';

function CreatPost({ onChangeNewPost }) {
	const [showModalCreatPost, setShowModalCreatPost] = useState(false);
	const [option, setOption] = useState({});
	const creatPostModalContainer = useRef(null);
	const scrollBlocked = useRef(false);
	const location = useLocation();

	const {
		auth: { userInfo },
		book: { bookForCreatePost },
	} = useSelector(state => state);
	const dispatch = useDispatch();

	const safeDocument = typeof document !== 'undefined' ? document : {};
	const { body } = safeDocument;
	const html = safeDocument.documentElement;
	let optionList = null;

	if (location.pathname === '/group') {
		optionList = [
			{
				value: 'addBook',
				title: 'sách',
				icon: <BookIcon className='newfeed__creat-post__options__item__logo--book' />,
				message: 'Không tìm thấy cuốn sách nào',
			},
			{
				value: 'addAuthor',
				title: 'tác giả',
				icon: <Feather className='item-add-to-post-svg' />,
				message: 'Không tìm thấy tác giả',
			},
			{
				value: 'addCategory',
				title: 'chủ đề',
				icon: <CategoryIcon className='newfeed__creat-post__options__item__logo--category' />,
				message: 'Không tìm thấy chủ đề',
			},
			{
				value: 'hashtag',
				title: 'Hashtag',
				icon: <Hashtag className='newfeed__creat-post__options__item__logo--friend' />,
				message: 'Không tìm thấy hashtag',
			},
		];
	} else {
		optionList = [
			{
				value: 'addBook',
				title: 'sách',
				icon: <BookIcon className='newfeed__creat-post__options__item__logo--book' />,
				message: 'Không tìm thấy cuốn sách nào',
			},
			{
				value: 'addAuthor',
				title: 'tác giả',
				icon: <Feather className='item-add-to-post-svg' />,
				message: 'Không tìm thấy tác giả',
			},
			{
				value: 'addCategory',
				title: 'chủ đề',
				icon: <CategoryIcon className='newfeed__creat-post__options__item__logo--category' />,
				message: 'Không tìm thấy chủ đề',
			},
			{
				value: 'addFriends',
				title: 'bạn bè',
				icon: <GroupIcon className='newfeed__creat-post__options__item__logo--friend' />,
				message: 'Không tìm thấy bạn bè',
			},
		];
	}

	useEffect(() => {
		if (!_.isEmpty(bookForCreatePost)) {
			setShowModalCreatPost(true);
		}
	}, [bookForCreatePost]);

	useEffect(() => {
		if (showModalCreatPost) {
			creatPostModalContainer.current.addEventListener('mousedown', e => {
				if (e.target === creatPostModalContainer.current) {
					hideCreatPostModal();
					dispatch(updateCurrentBook({}));
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
		setOption({});
	};

	const onChangeOption = data => {
		setOption(data);
	};

	const renderOptionList = () => {
		return optionList.map(item => (
			<div
				className='newfeed__creat-post__options__item'
				key={item.title}
				onClick={() => {
					onChangeOption(item);
					setShowModalCreatPost(true);
				}}
			>
				<div className='newfeed__creat-post__options__item__logo'>{item.icon}</div>
				<span className='text-'>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</span>
			</div>
		));
	};

	return (
		<div className='newfeed__creat-post'>
			<div className='newfeed__creat-post__avatar-and-input'>
				<UserAvatar className='newfeed__creat-post__avatar' source={userInfo?.avatarImage} />
				<input
					className='newfeed__creat-post__input'
					placeholder='Tạo bài viết của bạn ...'
					onClick={() => setShowModalCreatPost(true)}
				/>
			</div>
			<div className='newfeed__creat-post__options'>{renderOptionList()}</div>
			{showModalCreatPost && (
				<div className='newfeed__creat-post__modal' ref={creatPostModalContainer}>
					<CreatPostModalContent
						hideCreatPostModal={hideCreatPostModal}
						showModalCreatPost={showModalCreatPost}
						option={option}
						onChangeOption={onChangeOption}
						onChangeNewPost={onChangeNewPost}
					/>
				</div>
			)}
		</div>
	);
}
CreatPost.propTypes = {
	onChangeNewPost: PropTypes.func,
};
export default CreatPost;
