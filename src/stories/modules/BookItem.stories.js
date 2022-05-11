import BookItem from 'shared/book-item';

export default {
	title: 'Components/Modules/Book item',
	component: BookItem,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <BookItem {...args} />;

export const Default = Template.bind({});
Default.args = {
	data: {
		source: '',
		name: 'Tên sách trong tủ sách của tôi',
		author: 'Tác giả cuốn sách',
		rating: 4,
	},
};

export const MyBook = Template.bind({});
MyBook.args = {
	data: {
		source: 'https://file.mentor.vn/files/books/file-1636971030383.jpg',
		name: 'Bán đảo Ả rập – Tinh thần hồi giáo và thảm kịch dầu mỏ',
		author: 'Nguyễn Hiến Lê',
		rating: 4,
		isPublic: true,
	},
	isMyShelve: true,
};

export const PeopleBook = Template.bind({});
PeopleBook.args = {
	data: {
		source: 'https://file.mentor.vn/files/books/file-1638875033120.jpg',
		name: 'Bán đảo Ả rập – Tinh thần hồi giáo và thảm kịch dầu mỏ',
		author: 'Nguyễn Hiến Lê',
		rating: 4,
		isPublic: true,
	},
	isMyShelve: false,
};
