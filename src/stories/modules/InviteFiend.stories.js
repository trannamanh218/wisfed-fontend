import PopupInviteFriend from 'pages/group-page/popup-group/popupInviteFriend';

export default {
	title: 'Components/Modules/PopupInviteFriend',
	component: PopupInviteFriend,
};

const Template = agr => (
	<div>
		<PopupInviteFriend {...agr} />
	</div>
);

export const popupLayout = Template.bind({});
