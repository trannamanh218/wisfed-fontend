import MainGroupStories from 'pages/group-page/MainGroupStories';
import MainGroupComponent from 'pages/group-page/popup-group/MainGroupComponet/MainGroupComponent';

export default {
	title: 'Components/Modules/MainGroupStories',
	component: MainGroupStories,
};

const Template = args => (
	<div style={{ width: 720 }}>
		<MainGroupStories {...args} />
	</div>
);
const HeaderGroup = args => (
	<div style={{ width: 720 }}>
		<MainGroupComponent {...args} />
	</div>
);

export const Default = Template.bind({});
export const Header = HeaderGroup.bind({});
