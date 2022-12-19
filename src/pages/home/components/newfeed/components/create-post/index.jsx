import { BookIcon, CategoryIcon, Feather, GroupIcon } from 'components/svg';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import UserAvatar from 'shared/user-avatar';
import CreatePostModalContent from '../create-post-modal-content';
import Storage from 'helpers/Storage';
import { handleClickCreateNewPostForBook } from 'reducers/redux-utils/activity';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { setOptionAddToPost } from 'reducers/redux-utils/common';
import { blockAndAllowScroll } from 'api/blockAndAllowScroll.hook';

function CreatePost({ onChangeNewPost }) {
	const [showModalCreatePost, setShowModalCreatePost] = useState(false);
	const [showSubModal, setShowSubModal] = useState(false);

	const location = useLocation();

	const { userInfo } = useSelector(state => state.auth);

	const dispatch = useDispatch();

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

	blockAndAllowScroll(showModalCreatePost);

	const handleClickToOption = item => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			if (item.value === 'addBook') {
				dispatch(handleClickCreateNewPostForBook(true));
			}
			dispatch(setOptionAddToPost(item));
			setShowModalCreatePost(true);
			setShowSubModal(true);
		}
	};

	const renderOptionList = () => {
		return optionList.map(item => (
			<div
				className='newfeed__create-post__options__item'
				key={item.value}
				onClick={() => handleClickToOption(item)}
			>
				<div className='newfeed__create-post__options__item__logo'>{item.icon}</div>
				<span>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</span>
			</div>
		));
	};

	const handleUserLogin = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			setShowModalCreatePost(true);
		}
	};

	return (
		<div className='newfeed__create-post'>
			<div className='newfeed__create-post__avatar-and-input' onClick={handleUserLogin}>
				<UserAvatar className='newfeed__create-post__avatar' source={userInfo?.avatarImage} />
				<input className='newfeed__create-post__input' placeholder='Tạo bài viết của bạn ...' readOnly />
			</div>
			<div className='newfeed__create-post__options'>{renderOptionList()}</div>
			{showModalCreatePost && (
				<CreatePostModalContent
					setShowModalCreatePost={setShowModalCreatePost}
					showSubModal={showSubModal}
					setShowSubModal={setShowSubModal}
					onChangeNewPost={onChangeNewPost}
				/>
			)}
		</div>
	);
}

CreatePost.propTypes = {
	onChangeNewPost: PropTypes.func,
};

export default CreatePost;
