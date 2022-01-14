import SearchField from 'shared/search-field';

export default {
	title: 'Components/Simple/Seach Field',
	component: SearchField,
	argTypes: {
		handleChange: { action: 'onChange' },
	},
};

const Template = args => (
	<div style={{ width: '500px' }}>
		<SearchField {...args} />
	</div>
);

export const Default = Template.bind({});

export const Custom = Template.bind({});
Custom.args = {
	placeholder: 'Tìm kiếm trên Wisfeed',
};
