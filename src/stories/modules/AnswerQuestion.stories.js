import PopupQuestion from 'pages/group-page/popup-group/popupQuestion';

export default {
	title: 'Components/Modules/popupQuestion',
	component: PopupQuestion,
};

const Template = agr => (
	<div>
		<PopupQuestion {...agr} />
	</div>
);

export const popupLayout = Template.bind({});
