import BookImage from 'shared/book-image';

export default {
	title: 'Components/Simple/Book image',
	component: BookImage,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <BookImage {...args} />;

export const Default = Template.bind({});
