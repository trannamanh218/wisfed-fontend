import ForgetpasswordFormComponent from 'pages/foget-password/component/ForgetPasswordFormComponent';
export default {
	title: 'Components/Modules/ForgetPasswordEmailFrom',
	component: ForgetpasswordFormComponent,
};

const Template = args => (
	<div>
		<ForgetpasswordFormComponent {...args} />
	</div>
);

export const emmail = Template.bind({});
