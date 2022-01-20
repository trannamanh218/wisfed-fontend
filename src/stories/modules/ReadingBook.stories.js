import ReadingBook from 'shared/reading-book';

export default {
	title: 'Components/Modules/Reading Book',
	component: ReadingBook,
};

const Template = args => (
	<div style={{ width: '270px' }}>
		<ReadingBook {...args} />
	</div>
);

export const Custom = Template.bind({});
Custom.args = {
	bookData: { avatar: '/images/book1.jpg', name: 'Người thành công làm gì vào buổi tối', author: 'Đỗ Gia' },
	percent: 50,
};
