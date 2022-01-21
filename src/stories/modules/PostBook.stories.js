import PostBook from 'pages/home/components/newfeed/components/post-book';

export default {
	title: 'Components/Modules/Post Book',
	component: PostBook,
};

const Template = args => (
	<div style={{ width: '668px' }}>
		<PostBook {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	postInformations: { bookImage: '/images/book1.jpg', bookName: 'Người thành công làm gì vào buổi tối' },
};
