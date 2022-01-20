import ReplyBox from 'shared/reply-box';

export default {
	title: 'Components/Modules/Reply box',
	component: ReplyBox,
	argTypes: {
		handleChange: { action: 'onChange' },
	},
};

const Template = args => <ReplyBox {...args} />;
export const Defaut = Template.bind({});
