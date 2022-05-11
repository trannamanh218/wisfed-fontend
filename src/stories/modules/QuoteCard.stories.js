import QuoteCard from 'shared/quote-card';

export default {
	title: 'Components/Modules/Quote Card',
	component: QuoteCard,
};

const Template = args => <QuoteCard {...args} />;

export const Example = Template.bind({});
Example.args = {
	data: {
		content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam velit nemo voluptate. Eaque tenetur
		dolore qui doloribus modi alias labore deleniti quisquam sunt. Accusantium, accusamus eius ipsum optio
		distinctio laborum.`,
		avatar: '',
		author: 'Mai Nguyễn',
		bookName: 'Đắc nhân tâm',
	},
	badges: [{ title: 'Marketing' }, { title: 'Phát triển bản thân' }],
};
