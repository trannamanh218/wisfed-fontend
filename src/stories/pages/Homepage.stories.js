import Home from 'pages/home';

export default {
	title: 'Pages/Home',
	component: Home,
	parammeters: {
		deeplink: {
			route: '/profile',
			path: '/profile',
		},
	},
};

const Template = () => <Home />;

export const Default = Template.bind({});
