import TopQuotes from 'shared/top-quotes';

export default {
	title: 'Components/Modules/TopCardQuotes',
	component: TopQuotes,
};

const Template = args => (
	<div style={{ 'width': '650px', 'background': '#fbf7f2' }}>
		<TopQuotes {...args} />
	</div>
);

export const Custom = Template.bind({});
const fakeData = [...Array(5)].fill({
	name: `haha`,
});

Custom.args = {
	topics: fakeData,
};
