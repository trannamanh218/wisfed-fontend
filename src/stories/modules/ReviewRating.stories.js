import ReviewRating from 'shared/review-rating';

export default {
	title: 'Components/Modules/Review Rating',
	component: ReviewRating,
};

const Template = args => <ReviewRating {...args} />;

export const Custom = Template.bind({});
const listData = [
	{
		level: 5,
		percent: 40,
		total: 2000,
	},
	{
		level: 4,
		percent: 20,
		total: 2000,
	},
	{
		level: 3,
		percent: 10,
		total: 2000,
	},
	{
		level: 2,
		percent: 28,
		total: 2000,
	},
	{
		level: 1,
		percent: 2,
		total: 2000,
	},
];
console.log(listData);
Custom.args = {
	list: listData,
};
