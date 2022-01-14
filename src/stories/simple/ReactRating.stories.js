import ReactRating from 'shared/react-rating';

export default {
	title: 'Components/Simple/React Rating',
	component: ReactRating,
	argTypes: {
		handleChange: { action: 'onChange' },
	},
};

const Template = args => <ReactRating {...args} />;

export const Normal = Template.bind({});
Normal.args = {
	initialRating: 0,
	stop: 5,
	readonly: false,
};
