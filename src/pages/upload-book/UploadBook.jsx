import MainContainer from 'components/layout/main-container';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainUpload from './main-upload/MainUpload';
import SidebarUpload from './sidebar-upload/SidebarUpload';
import { getBookDetail } from 'reducers/redux-utils/book';
import RouteLink from 'helpers/RouteLink';
import { NotificationError } from 'helpers/Error';
import { handleShelvesGroup } from 'api/shelvesGroup.hooks';
import './UploadBook.scss';

export default function UploadBook() {
	const [currentUserInfo, setCurrentUserInfo] = useState({});
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const navigate = useNavigate();
	const { shelveGroupName } = handleShelvesGroup(userInfo.id);

	useEffect(() => {
		window.scroll(0, 0);
		setCurrentUserInfo(userInfo);
	}, [userInfo]);

	const handleViewBookDetail = async data => {
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='upload-main-container'>
			<MainContainer
				main={<MainUpload />}
				right={
					<SidebarUpload
						userInfo={userInfo}
						currentUserInfo={currentUserInfo}
						handleViewBookDetail={handleViewBookDetail}
						shelveGroupName={shelveGroupName}
					/>
				}
			/>
		</div>
	);
}
