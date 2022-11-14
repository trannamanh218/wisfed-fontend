import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { getUserDetail } from 'reducers/redux-utils/user';
import { setCurrentUserInShelves } from 'reducers/redux-utils/shelves';
import { getAllLibraryList } from 'reducers/redux-utils/library';

export const handleShelvesGroup = currentUserShelveId => {
	const [isLoading, setIsLoading] = useState(false);
	const [shelveGroupName, setShelveGroupName] = useState('');
	const [isMine, setIsMine] = useState();
	const [allLibrary, setAllLibrary] = useState({});
	const [renderNotFound, setRenderNotFound] = useState(false);

	const dispatch = useDispatch();

	const userInfo = useSelector(state => state.auth.userInfo);
	const currentUserShelveRedux = useSelector(state => state.shelves.currentUserInShelves);
	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	const url = window.location.pathname;

	useEffect(() => {
		check();
	}, [userInfo, currentUserShelveId, myAllLibraryRedux]);

	const check = async () => {
		let data;
		try {
			if (url.includes('/shelves/')) {
				if (!_.isEmpty(userInfo)) {
					if (currentUserShelveId !== userInfo.id) {
						setIsLoading(true);
						const user = await dispatch(getUserDetail(currentUserShelveId)).unwrap();
						const allLibraryData = await dispatch(
							getAllLibraryList({ userId: currentUserShelveId })
						).unwrap();
						data = {
							userId: user.id,
							userFullName: user.fullName,
							isMine: false,
							allLibrary: allLibraryData,
						};
						setShelveGroupName(user.fullName);
						setIsMine(false);
						setAllLibrary(allLibraryData);
					} else {
						data = {
							userId: userInfo.id,
							userFullName: 'tôi',
							isMine: true,
							allLibrary: myAllLibraryRedux,
						};
						setIsMine(true);
						setShelveGroupName('tôi');
						setAllLibrary(myAllLibraryRedux);
					}
					dispatch(setCurrentUserInShelves(data));
				}
			} else {
				if (!_.isEmpty(currentUserShelveRedux)) {
					setShelveGroupName(currentUserShelveRedux.userFullName);
					setIsMine(currentUserShelveRedux.isMine);
					setAllLibrary(currentUserShelveRedux.allLibrary);
				} else {
					if (!_.isEmpty(userInfo)) {
						if (currentUserShelveId !== userInfo.id) {
							setIsLoading(true);
							const user = await dispatch(getUserDetail(currentUserShelveId)).unwrap();
							const allLibraryData = await dispatch(
								getAllLibraryList({ userId: currentUserShelveId })
							).unwrap();
							data = {
								userId: user.id,
								userFullName: user.fullName,
								isMine: false,
								allLibrary: allLibraryData,
							};
							setShelveGroupName(user.fullName);
							setIsMine(false);
							setAllLibrary(allLibraryData);
						} else {
							data = {
								userId: userInfo.id,
								userFullName: 'tôi',
								isMine: true,
								allLibrary: myAllLibraryRedux,
							};
							setIsMine(true);
							setShelveGroupName('tôi');
							setAllLibrary(myAllLibraryRedux);
						}
						// dispatch(setCurrentUserInShelves(data));
					}
				}
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
