import MainContainer from 'components/layout/main-container';
import MainReadingSummary from './main-reading-summary';
import SidebarReadingSummary from './sidebar-reading-summary';

const ReadingSummary = () => {
	return <MainContainer main={<MainReadingSummary />} right={<SidebarReadingSummary />} />;
};

export default ReadingSummary;
