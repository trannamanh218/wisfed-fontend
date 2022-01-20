import Comment from 'shared/comment';

export default {
	title: 'Components/Modules/Comment',
	component: Comment,
	argTypes: {
		handleLike: { action: 'onClick' },
		handleReply: { action: 'onClick' },
	},
};

const Template = args => <Comment {...args} />;

export const Author = Template.bind({});
Author.args = {
	data: {
		avatar: '/images/avatar.png',
		isAuthor: true,
		author: 'Tiramisu N',
		content: `ipsum dolor sit amet consectetur adipisicing elit. Quidem eum error totam, iusto mollitia
		nemo minus corporis deleniti ut minima?`,
		duration: 10,
	},
};

export const People = Template.bind({});
People.args = {
	data: {
		isAuthor: false,
		author: 'Kenvin Powell',
		content: `ipsum dolor sit amet consectetur adipisicing elit. Quidem eum error totam, iusto mollitia
		nemo minus corporis deleniti ut minima?`,
		duration: 10,
	},
};
