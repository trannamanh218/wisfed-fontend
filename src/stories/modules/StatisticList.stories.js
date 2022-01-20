import StatisticList from 'shared/statistic-list';

export default {
	title: 'Components/Modules/Statistic List',
	component: StatisticList,
};

const Template = args => <StatisticList {...args} />;

export const StatusReading = Template.bind({});
StatusReading.args = {
	title: 'Trạng thái đọc',
	background: 'light',
	isBackground: false,
	list: [
		{ name: 'Muốn đọc', quantity: 30 },
		{ name: 'Đang đọc', quantity: 110 },
		{ name: 'Đã đọc', quantity: 8 },
		{ name: 'Yêu thích', quantity: 0 },
		{ name: 'Khuyên đọc', quantity: 9 },
	],
};
