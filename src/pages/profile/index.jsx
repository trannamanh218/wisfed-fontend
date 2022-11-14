import MainContainer from 'components/layout/main-container';
import MainProfile from './main-profile';
import SidebarProfile from './sidebar-profile';
import { useState, useEffect } from 'react';
import { getUserDetail } from 'reducers/redux-utils/user';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { checkGetUser } from 'reducers/redux-utils/profile';
import RouteLink from 'helpers/RouteLink';
import { getBookDetail } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';
import _ from 'lodash';
import NotFound from 'pages/not-found';

const Profile = () => {
	const [currentUserInfo, setCurrentUserInfo] = useState({});
	const [status, setStatus] = useState(false);
	const [renderNotFound, setRenderNotFound] = useState(false);

	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const { isReload } = useSelector(state => state.user);
	const { userId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (userInfo.id === userId) {
			setCurrentUserInfo(userInfo);
			dispatch(checkGetUser(false));
		} else {
			getUserDetailData();
			dispatch(checkGetUser(true));
		}
	}, [userId, isReload]);

	const getUserDetailData = async () => {
		try {
			const userData = await dispatch(getUserDetail(userId)).unwrap();
			setCurrentUserInfo(userData);
		} catch (err) {
			return;
		} finally {
			setRenderNotFound(true);
		}
	};

	const handleViewBookDetail = async data => {
		setStatus(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		} finally {
			setStatus(false);
		}
	};

	return (
		<>
			<Circle loading={status} />
			{!_.isEmpty(currentUserInfo) ? (
				<MainContainer
					main={<MainProfile currentUserInfo={currentUserInfo} />}
					right={
						<SidebarProfile currentUserInfo={currentUserInfo} handleViewBookDetail={handleViewBookDetail} />
					}
				/>
			) : (
				<>{renderNotFound && <NotFound />}</>
			)}
		</>
	);
};

export default Profile;
