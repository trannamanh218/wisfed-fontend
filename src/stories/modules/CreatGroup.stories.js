import PopupCreatGroup from 'pages/group-page/PopupCreateGroup';

export default {
	title: 'Components/Modules/PopupCreatGroup',
	component: PopupCreatGroup,
};

const Template = agr => (
	<div>
		<PopupCreatGroup {...agr} />
	</div>
);

export const popupLayout = Template.bind({});
