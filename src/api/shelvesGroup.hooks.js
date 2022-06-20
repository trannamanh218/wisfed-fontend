import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { getUserDetail } from 'reducers/redux-utils/user';
import { setCurrentUserInShelves } from 'reducers/redux-utils/shelves';

export const handleShelvesGroup = currentUserShelveId => {
	const [isLoading, setIsLoading] = useState(false);
	const [shelveGroupName, setShelveGroupName] = useState('');
	const [isMine, setIsMine] = useState();

	const dispatch = useDispatch();

	const userInfo = useSelector(state => state.auth.userInfo);
	const currentUserShelveRedux = useSelector(state => state.shelves.currentUserInShelves);
	const url = window.location.pathname;

	useEffect(() => {
		chek();
	}, [userInfo, currentUserShelveId]);

	const chek = async () => {
		if (url.includes('/shelves/')) {
			if (!_.isEmpty(userInfo)) {
				let data;
				if (currentUserShelveId !== userInfo.id) {
					setIsLoading(true);
					const user = await dispatch(getUserDetail(currentUserShelveId)).unwrap();
					data = {
						userId: user.id,
						userFullName: user.fullName,
						isMine: false,
					};
					setShelveGroupName(user.fullName);
					setIsMine(false);
				} else {
					data = {
						userId: userInfo.id,
						userFullName: 'tôi',
						isMine: true,
					};
					setIsMine(true);
					setShelveGroupName('tôi');
				}
				dispatch(setCurrentUserInShelves(data));
			}
		} else {
			if (!_.isEmpty(currentUserShelveRedux)) {
				setShelveGroupName(currentUserShelveRedux.userFullName);
				setIsMine(currentUserShelveRedux.isMine);
			} else {
				if (!_.isEmpty(userInfo)) {
					let data;
					if (currentUserShelveId !== userInfo.id) {
						setIsLoading(true);
						const user = await dispatch(getUserDetail(currentUserShelveId)).unwrap();
						data = {
							userId: user.id,
							userFullName: user.fullName,
							isMine: false,
						};
						setShelveGroupName(user.fullName);
						setIsMine(false);
					} else {
						data = {
							userId: userInfo.id,
							userFullName: 'tôi',
							isMine: true,
						};
						setIsMine(true);
						setShelveGroupName('tôi');
					}
					dispatch(setCurrentUserInShelves(data));
				}
			}
		}
		setIsLoading(false);
	};
	return { isLoading, shelveGroupName, isMine };
};
