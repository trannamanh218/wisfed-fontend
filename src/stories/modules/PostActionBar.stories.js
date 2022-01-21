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
	postInformations: {
		isLike: false,
		likeNumber: 0,
		commentNumber: 0,
		shareNumber: 0,
	},
};

export const Custom = Template.bind({});
Custom.args = {
	postInformations: {
		isLike: true,
		likeNumber: 12,
		commentNumber: 10,
		shareNumber: 27,
	},
};
