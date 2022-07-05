import MainContainer from 'components/layout/main-container';
import { useEffect } from 'react';
import MainReadingSummary from './main-reading-summary';
import SidebarReadingSummary from './sidebar-reading-summary';

const ReadingSummary = () => {
	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	return <MainContainer main={<MainReadingSummary />} right={<SidebarReadingSummary />} />;
};

export default ReadingSummary;
