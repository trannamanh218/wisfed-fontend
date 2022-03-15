import CategoryDetail from 'pages/category-detail';

export default {
	title: 'Pages/Category Page Detail',
	component: CategoryDetail,
};

const Template = () => <CategoryDetail />;

export const Default = Template.bind({});
Default.parameters = {
	deeplink: {
		path: '/category/detail/:id',
		route: '/category/detail/12',
	},
};
