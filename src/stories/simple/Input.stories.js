import Input from 'shared/input';

export default {
	title: 'Components/Simple/Input',
	component: Input,
	argTypes: {
		handleChange: { action: 'onChange' },
	},
};

const Template = args => (
	<div style={{ width: `500px` }}>
		<Input {...args} />
	</div>
);

export const Default = Template.bind({});

export const Gray = Template.bind({});
Gray.args = {
	placeholder: 'Vui lòng nhập thêm thông tin...',
	backgroundColor: '#f7f7fc',
	isBorder: false,
};
