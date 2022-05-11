import QuoteActionBar from 'shared/quote-action-bar';

export default {
	title: 'Components/Modules/Quote Action Bar',
	component: QuoteActionBar,
	argTypes: {
		handleLikeQuote: { action: 'onClick' },
	},
};

const Template = args => <QuoteActionBar {...args} />;

export const Default = Template.bind({});
Default.args = {
	data: {
		likeNumbers: 0,
		shareNumbers: 0,
		isShare: false,
		isLike: false,
	},
	isDetail: false,
};

export const ActiveLike = Template.bind({});
ActiveLike.args = {
	data: {
		likeNumbers: 0,
		shareNumbers: 10,
		isShare: false,
		isLike: true,
	},
	isDetail: false,
};

export const ActiveShare = Template.bind({});
ActiveShare.args = {
	data: {
		likeNumbers: 7,
		shareNumbers: 10,
		isShare: true,
		isLike: false,
	},
	isDetail: false,
};

export const Personal = Template.bind({});
Personal.args = {
	data: {
		likeNumbers: 7,
		shareNumbers: 10,
		commentNumbers: 20,
		isShare: true,
		isLike: true,
	},
	isDetail: true,
};
