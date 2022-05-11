import UserAvatar from 'shared/user-avatar';

export default {
	title: 'Components/Simple/User Avatar',
	component: UserAvatar,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <UserAvatar {...args} />;

export const Default = Template.bind({});

export const Custom = Template.bind({});
Custom.args = {
	size: 'lg',
	source: 'https://salt.tikicdn.com/cache/w1200/ts/product/26/22/83/6d0989f01be26645d50216c34a9f46b7.jpg',
};
