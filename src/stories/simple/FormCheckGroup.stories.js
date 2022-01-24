import FormCheckGroup from 'shared/form-check-group';

export default {
	title: 'Components/Simple/Form Check Group',
	component: FormCheckGroup,
	argTypes: {
		handleChange: { action: 'onChange' },
	},
};

const Template = args => <FormCheckGroup {...args} />;

export const Checkbox = Template.bind({});
Checkbox.args = {
	type: 'checkbox',
	name: 'Tu sach 2022',
};

export const Radio = Template.bind({});
Radio.args = {
	type: 'radio',
	name: 'Review xem nhiều nhất',
};
