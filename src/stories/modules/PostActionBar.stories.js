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

export const Custom = Template.bind({});
Custom.args = {
	postInformations: {
		isLike: true,
		likeNumber: 12,
		commentNumber: 10,
		shareNumber: 27,
	},
};
