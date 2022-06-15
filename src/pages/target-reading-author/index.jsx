import MainContainer from 'components/layout/main-container';
import MainReadingAuthor from './main-reading-summary-author';
import SidebarReadingSummary from '../reading-target/sidebar-reading-target';
import { useSelector } from 'react-redux';

const ReadingSummaryAuthor = () => {
	const currentUserData = useSelector(state => state.shelves.currentUserInShelves);

	return (
		<MainContainer
			main={<MainReadingAuthor currentUserShelveData={currentUserData} />}
			right={<SidebarReadingSummary currentUserShelveData={currentUserData} />}
		/>
	);
};

export default ReadingSummaryAuthor;
