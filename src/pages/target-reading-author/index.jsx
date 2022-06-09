import MainContainer from 'components/layout/main-container';
import MainReadingAuthor from './main-reading-summary-author';
import SidebarReadingSummary from '../reading-target/sidebar-reading-target';

const ReadingSummaryAuthor = () => {
	return <MainContainer main={<MainReadingAuthor />} right={<SidebarReadingSummary />} />;
};

export default ReadingSummaryAuthor;
