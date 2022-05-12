import MainContainer from 'components/layout/main-container';
import MainConfirmMyBook from './main-confirm-my-book/mainConfirmMyBook';
import SidebarProfile from 'pages/profile/sidebar-profile';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useEffect, useState } from 'react';

function ConfirmMyBook() {
	const userInfo = useSelector(state => state.auth.userInfo);

	const [currentUserInfo, setCurrentUserInfo] = useState({});

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			setCurrentUserInfo(userInfo);
		}
	}, [userInfo]);

	return <MainContainer main={<MainConfirmMyBook />} right={<SidebarProfile currentUserInfo={currentUserInfo} />} />;
}

export default ConfirmMyBook;
