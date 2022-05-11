import LinearProgressBar from 'shared/linear-progress-bar';

export default {
	title: 'Components/Simple/Linear progress bar',
	component: LinearProgressBar,
};

const Template = args => <LinearProgressBar {...args} />;

export const Default = Template.bind({});
Default.args = {
	percent: 50,
	// backgroundColor: '#e0af7e'
};
