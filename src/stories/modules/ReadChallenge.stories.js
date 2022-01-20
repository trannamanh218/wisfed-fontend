import ReadChallenge from 'shared/read-challenge';

export default {
	title: 'Components/Modules/Reading Challenge',
	component: ReadChallenge,
};

const Template = args => (
	<div style={{ width: '270px' }}>
		<ReadChallenge {...args} />
	</div>
);

export const Default = Template.bind({});
