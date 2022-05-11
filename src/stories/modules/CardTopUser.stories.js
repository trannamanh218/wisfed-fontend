import AuthorCard from 'shared/author-card';

export default {
	title: 'Components/Modules/AuthorCard',
	component: AuthorCard,
};

const Template = args => (
	<div style={{ 'width': '650px', 'background': '#fbf7f2' }}>
		<AuthorCard {...args} />
	</div>
);

export const Custom = Template.bind({});
const fakeData = [...Array(5)].fill({
	name: `haha`,
});

Custom.args = {
	topics: fakeData,
};
