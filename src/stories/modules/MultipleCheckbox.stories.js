import MultipleCheckbox from 'shared/multiple-checkbox';

export default {
	title: 'Components/Modules/Multiple checkbox',
	component: MultipleCheckbox,
	argTypes: {
		handleChange: { action: 'onChange' },
	},
};

const Template = args => <MultipleCheckbox {...args} />;

export const Default = Template.bind({});

export const Custom = Template.bind({});
const fakeData = [
	{
		'title': 'Title 1',
		'value': 1,
	},
	{
		'title': 'Title 2',
		'value': 2,
	},
	{
		'title': 'Title 3',
		'value': 3,
	},
	{
		'title': 'Title 4',
		'value': 4,
	},
	{
		'title': 'Title 5',
		'value': 5,
	},
];

Custom.args = {
	list: fakeData,
	name: 'review',
};
