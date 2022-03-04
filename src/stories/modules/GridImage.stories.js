import GridImage from 'shared/grid-image';

export default {
	title: 'Components/Modules/Grid Image',
	component: GridImage,
};

const Template = args => (
	<div style={{ width: '600px' }}>
		<GridImage {...args} />
	</div>
);

export const Single = Template.bind({});
Single.args = {
	images: new Array(1).fill(
		'https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80'
	),
	id: 1,
};

export const Third = Template.bind({});
Third.args = {
	images: new Array(3).fill(
		'https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80'
	),
	id: 2,
};

export const Multiple = Template.bind({});
Multiple.args = {
	images: new Array(7).fill(
		'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fGZsb3dlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
	),
	id: 'multiple',
};
