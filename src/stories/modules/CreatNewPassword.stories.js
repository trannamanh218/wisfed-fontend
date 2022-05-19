import CreatNewPasswordForm from 'pages/foget-password/component/CreateNewPasswordForm';

export default {
	title: 'Components/Modules/CreatNewPassword',
	component: CreatNewPasswordForm,
};

const Template = agr => (
	<div>
		<CreatNewPasswordForm {...agr} />{' '}
	</div>
);

export const form = Template.bind({});
