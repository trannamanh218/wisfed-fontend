import MainContainer from 'components/layout/main-container';
import MainProfile from './main-profile';
import SidebarProfile from './sidebar-profile';

import { useState, useEffect } from 'react';
import { getUserDetail } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';

const Profile = () => {
	const [currentUserInfo, setCurrentUserInfo] = useState({});

	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const { userId } = useParams();

	useEffect(() => {
		getUserDetailData();
	}, [userId, userInfo]);

	const getUserDetailData = async () => {
		try {
			const userData = await dispatch(getUserDetail(userId)).unwrap();
			setCurrentUserInfo(userData);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<MainContainer
			main={<MainProfile currentUserInfo={currentUserInfo} />}
			right={<SidebarProfile currentUserInfo={currentUserInfo} />}
		/>
	);
};

export default Profile;
