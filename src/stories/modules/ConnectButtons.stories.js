import ConnectButtons from 'shared/connect-buttons';

export default {
	title: 'Components/Modules/Connect Buttons',
	component: ConnectButtons,
};

const Template = args => <ConnectButtons {...args} />;

export const Horizontal = Template.bind({});

Horizontal.args = {
	direction: 'row',
	data: {
		isFriend: false,
		isFollow: false,
	},
};

export const Vertical = Template.bind({});
Vertical.args = {
	direction: 'column',
	data: {
		isFriend: true,
		isFollow: false,
	},
};
