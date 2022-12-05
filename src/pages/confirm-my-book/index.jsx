import MainContainer from 'components/layout/main-container';
import MainConfirmMyBook from './main-confirm-my-book/mainConfirmMyBook';
import SidebarProfile from 'pages/profile/sidebar-profile';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import NotFound from 'pages/not-found';
import { useNavigate } from 'react-router-dom';

function ConfirmMyBook() {
	const navigate = useNavigate();
	const userInfo = useSelector(state => state.auth.userInfo);

	const [currentUserInfo, setCurrentUserInfo] = useState({});
	const [errorLoadPage, setErrorLoadPage] = useState(false);

	useEffect(() => {
		if (!_.isEmpty(userInfo)) {
			if (['reader'].includes(userInfo.role)) {
				navigate('/');
			}
			setCurrentUserInfo(userInfo);
		}
	}, [userInfo]);

	return (
		<>
			{!errorLoadPage ? (
				<MainContainer
					main={<MainConfirmMyBook setErrorLoadPage={setErrorLoadPage} />}
					right={<SidebarProfile currentUserInfo={currentUserInfo} />}
				/>
			) : (
				<NotFound />
			)}
		</>
	);
}

export default ConfirmMyBook;
