import Button from 'shared/button';

export default {
	title: 'Components/Simple/Button',
	component: Button,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <Button {...args} />;

export const Default = Template.bind({});

export const Outline = Template.bind({});
Outline.args = {
	isOutline: true,
	varient: 'success',
	content: 'Hover me!',
};
