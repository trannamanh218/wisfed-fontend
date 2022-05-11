import Button from 'shared/button';

export default {
	title: 'Components/Simple/Button',
	component: Button,
};

const Template = args => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
	children: 'Click me!',
};

export const Outline = Template.bind({});
Outline.args = {
	isOutline: true,
	varient: 'success',
	children: 'Hover me!',
};
