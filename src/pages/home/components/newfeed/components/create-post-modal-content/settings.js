import { BookIcon, CategoryIcon, Feather, GroupIcon, Lock, PodCast, WorldNet } from 'components/svg';

export const setting = {
	optionList: [
		{
			value: 'addBook',
			title: 'sách',
			icon: <BookIcon />,
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
			icon: <CategoryIcon className='item-add-to-post-svg' />,
			message: 'Không tìm thấy chủ đề',
		},
		{
			value: 'addFriends',
			title: 'bạn bè',
			icon: <GroupIcon className='item-add-to-post-svg' />,
			message: 'Không tìm thấy bạn bè',
		},
	],
	shareModeList: [
		{ value: 'public', title: 'Mọi người', icon: <WorldNet /> },
		{ value: 'friends', title: 'Bạn bè', icon: <GroupIcon className='group-icon-svg' /> },
		{ value: 'followers', title: 'Người Follow', icon: <PodCast /> },
		{ value: 'private', title: 'Chỉ mình tôi', icon: <Lock /> },
	],
};
