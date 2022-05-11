import SidebarGroupLef from 'pages/group-page/sidebar-left';

export default {
	title: 'Components/Modules/SibarleftGroup',
	component: SidebarGroupLef,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <SidebarGroupLef {...args} />;

export const Default = Template.bind({});
