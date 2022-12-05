import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { getUserDetail } from 'reducers/redux-utils/user';
import { getAllLibraryList } from 'reducers/redux-utils/library';
import { NotificationError } from 'helpers/Error';

export const handleShelvesGroup = currentUserShelveId => {
	const [isLoading, setIsLoading] = useState(false);
	const [shelveGroupName, setShelveGroupName] = useState('');
	const [isMine, setIsMine] = useState();
	const [allLibrary, setAllLibrary] = useState({});
	const [renderNotFound, setRenderNotFound] = useState(false);

	const dispatch = useDispatch();

	const userInfo = useSelector(state => state.auth.userInfo);
	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	useEffect(() => {
		getShelveInfo();
	}, [userInfo, currentUserShelveId, myAllLibraryRedux]);

	const handleGetUserInfo = async () => {
		try {
			const user = await dispatch(getUserDetail(currentUserShelveId)).unwrap();
			return user;
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleGetLibrariesInfo = async () => {
		try {
			const allLibraryData = await dispatch(getAllLibraryList({ userId: currentUserShelveId })).unwrap();
			return allLibraryData;
		} catch (err) {
			NotificationError(err);
		}
	};

	const getShelveInfo = async () => {
		try {
			if (currentUserShelveId !== userInfo.id) {
				setIsLoading(true);
				Promise.all([handleGetUserInfo(), handleGetLibrariesInfo()]).then(data => {
					const user = data[0];
					const allLibraryData = data[1];
					setShelveGroupName(user.fullName);
					setIsMine(false);
					setAllLibrary(allLibraryData);
				});
			} else {
				setIsMine(true);
				setShelveGroupName('tôi');
				setAllLibrary(myAllLibraryRedux);
			}
		} catch (err) {
			setRenderNotFound(true);
			return;
		} finally {
			setIsLoading(false);
		}
	};
	return { isLoading, shelveGroupName, isMine, allLibrary, renderNotFound };
};
