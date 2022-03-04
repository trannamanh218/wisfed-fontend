import MainContainer from 'components/layout/main-container';
import MainConfirmMyBook from './main-confirm-my-book/mainConfirmMyBook';
import SidebarProfile from 'pages/profile/sidebar-profile';

function ConfirmMyBook() {
	return <MainContainer main={<MainConfirmMyBook />} right={<SidebarProfile />} />;
}

export default ConfirmMyBook;
