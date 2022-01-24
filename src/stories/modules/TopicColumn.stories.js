import TopicColumn from 'shared/topic-column';

export default {
	title: 'Components/Modules/Topic Column',
	component: TopicColumn,
};

const Template = args => <TopicColumn {...args} />;

export const Custom = Template.bind({});
const fakeData = Array.from(Array(45)).map((_, index) => ({
	name: `Kinh doanh ${index}`,
}));

Custom.args = {
	topics: fakeData,
};
