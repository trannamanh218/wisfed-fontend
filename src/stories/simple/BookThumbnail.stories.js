import BookThumbnail from 'shared/book-thumbnail';

export default {
	title: 'Components/Simple/Book thumbnail',
	component: BookThumbnail,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <BookThumbnail {...args} />;

export const Default = Template.bind({});
