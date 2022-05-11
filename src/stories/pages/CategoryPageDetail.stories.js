import CategoryDetail from 'pages/category-detail';

export default {
	title: 'Pages/Category Page Detail',
	component: CategoryDetail,
	parameters: {
		deeplink: {
			path: '/category/detail/:id',
			route: '/category/detail/12',
		},
	},
};

const Template = () => <CategoryDetail />;

export const Default = Template.bind({});
