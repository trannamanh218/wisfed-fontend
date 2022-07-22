import MainContainer from 'components/layout/main-container';
import MainProfile from './main-profile';
import SidebarProfile from './sidebar-profile';
import { useState, useEffect } from 'react';
import { getUserDetail } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import { checkGetUser } from 'reducers/redux-utils/profile';
import RouteLink from 'helpers/RouteLink';
import { getBookDetail } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';

const Profile = () => {
	const [currentUserInfo, setCurrentUserInfo] = useState({});
	const [status, setStatus] = useState(false);

	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const { isreload } = useSelector(state => state.user);
	const { userId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		window.scroll(0, 0);
		getUserDetailData();
	}, [userId, userInfo, isreload]);

	const getUserDetailData = async () => {
		try {
			const userData = await dispatch(getUserDetail(userId)).unwrap();
			setCurrentUserInfo(userData);
			if (userInfo.id === userData.id) {
				dispatch(checkGetUser(false));
			} else {
				dispatch(checkGetUser(true));
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleViewBookDetail = async data => {
		setStatus(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		} finally {
			setStatus(false);
		}
	};

	return (
		<>
			<Circle loading={status} />
			<MainContainer
				main={<MainProfile currentUserInfo={currentUserInfo} />}
				right={<SidebarProfile currentUserInfo={currentUserInfo} handleViewBookDetail={handleViewBookDetail} />}
			/>
		</>
	);
};

export default Profile;
