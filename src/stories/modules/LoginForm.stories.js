import LoginBox from 'pages/login/element/LoginBox';
export default {
	title: 'Components/Modules/LoginBox',
	component: LoginBox,
};

const Template = args => (
	<div>
		<LoginBox {...args} />
	</div>
);

export const box = Template.bind({});
