import TopUserRanks from 'shared/top-ranks';

export default {
	title: 'Components/Modules/TopUserRanks',
	component: TopUserRanks,
};

const Template = args => <TopUserRanks {...args} />;

export const Custom = Template.bind({});
const fakeData = [...Array(5)].fill({
	name: `haha`,
});

Custom.args = {
	topics: fakeData,
};
