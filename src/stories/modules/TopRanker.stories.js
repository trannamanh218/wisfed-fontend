import TopRanks from 'shared/top-ranks';

export default {
	title: 'Components/Modules/TopRanks',
	component: TopRanks,
};

const Template = args => <TopRanks {...args} />;

export const Custom = Template.bind({});
const fakeData = [...Array(5)].fill({
	name: `haha`,
});

Custom.args = {
	topics: fakeData,
};
