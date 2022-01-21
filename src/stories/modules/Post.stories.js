import Post from 'pages/home/components/newfeed/components/post';

export default {
	title: 'Components/Modules/Post',
	component: Post,
};

const Template = args => (
	<div style={{ width: '668px' }}>
		<Post {...args} />
	</div>
);

export const HasShareBook = Template.bind({});
HasShareBook.args = {
	postInformations: {
		id: 1,
		userAvatar: '/images/avatar.png',
		userName: 'Trần Văn Đức',
		bookImage: '/images/book1.jpg',
		bookName: 'House of the Witch',
		isLike: true,
		likes: 15,
	},
	likeAction: postInformations => {
		return postInformations;
	},
};

export const HasNotShareBook = Template.bind({});
HasNotShareBook.args = {
	postInformations: {
		id: 1,
		userAvatar: '/images/avatar.png',
		userName: 'Trần Văn Đức',
		bookImage: '',
		bookName: '',
		isLike: true,
		likes: 15,
	},
	likeAction: postInformations => {
		return postInformations;
	},
};
