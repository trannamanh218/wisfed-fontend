import PostActionBar from 'shared/post-action-bar';

export default {
	title: 'Components/Modules/Post Action Bar',
	component: PostActionBar,
	argTypes: {
		handleLikeStatus: { action: 'onClick' },
	},
};

const Template = args => <PostActionBar {...args} />;

export const Default = Template.bind({});
Default.args = {
	data: {
		isLike: false,
		likeNumbers: 0,
		commentNumbers: 0,
		shareNumbers: 0,
	},
};

export const Custom = Template.bind({});
Custom.args = {
	data: {
		isLike: true,
		likeNumbers: 12,
		commentNumbers: 10,
		shareNumbers: 27,
	},
};
