import LeftSidebarGroup from 'pages/group-page/sidebar-left';

export default {
	title: 'Components/Modules/SibarleftGroup',
	component: LeftSidebarGroup,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <LeftSidebarGroup {...args} />;

export const Default = Template.bind({});
