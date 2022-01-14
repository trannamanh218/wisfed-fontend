import BookSlider from 'shared/book-slider';

export default {
	title: 'Components/Modules/Book Slider',
	component: BookSlider,
};

const Template = args => (
	<div style={{ width: '500px' }}>
		<BookSlider {...args} />
	</div>
);

export const BlankList = Template.bind({});
BlankList.args = {
	title: 'Sách muốn đọc',
};

const customData = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });
export const Custom = Template.bind({});
Custom.args = {
	list: customData,
	title: 'Sách cùng thể loại',
};
