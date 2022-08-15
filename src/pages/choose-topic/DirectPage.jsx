import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkApiToken, getCheckJwt } from 'reducers/redux-utils/auth';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';
import { NotificationError } from 'helpers/Error';

export default function Direct() {
	const [isFetching, setIsFetching] = useState(true);
	const search = useSearchParams();
	const newToken = search[0].get('token');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const checkToken = async () => {
		try {
			const checkApiTokenAction = await dispatch(checkApiToken(newToken)).unwrap();
			if (checkApiTokenAction) {
				navigate('/creat-newpassword-admin');
			}
		} catch {
			const customId = 'custom-id-Direct';
			toast.error('Đường dẫn đã hết hạn hoặc không đúng. Vui lòng thử lại', { toastId: customId });
			navigate('/forget-password-admin');
		}
	};

	useEffect(async () => {
		if (location.pathname === 'direct') {
			checkToken();
			setIsFetching(false);
		} else if (location.pathname === '/direct/login') {
			localStorage.setItem('accessToken', newToken);
			setIsFetching(false);
			try {
				const actionCheck = await dispatch(getCheckJwt);
				if (actionCheck) {
					navigate('/');
				}
			} catch (err) {
				NotificationError(err);
			}
		}
	}, [newToken]);

	return (
		<>
			<Circle loading={isFetching} />
		</>
	);
}

// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useLocation, useSearchParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { checkApiToken, getCheckJwt } from 'reducers/redux-utils/auth';
// import { useNavigate } from 'react-router-dom';
// import Circle from 'shared/loading/circle';
// import { NotificationError } from 'helpers/Error';
// import axios from 'axios';
// import { updateUserInfo } from 'reducers/redux-utils/auth';
//
// export default function Direct() {
// 	const search = useSearchParams();
// 	const newToken = search[0].get('token');
// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();
// 	const location = useLocation();
//
// 	const checkToken = async () => {
// 		try {
// 			const checkApiTokenAction = await dispatch(checkApiToken(newToken)).unwrap();
// 			if (checkApiTokenAction) {
// 				navigate('/creat-newpassword-admin');
// 			}
// 		} catch {
// 			const customId = 'custom-id-Direct';
// 			toast.error('Đường dẫn đã hết hạn hoặc không đúng. Vui lòng thử lại', { toastId: customId });
// 			navigate('/forget-password-admin');
// 		}
// 	};
//
// 	const getJwt = async () => {
// 		try {
// 			const jwtData = await axios.get('https://wisfeed.tecinus.vn/api/v1/auth/jwt', {
// 				headers: { Authorization: `Bearer ${newToken}` },
// 			});
// 			dispatch(updateUserInfo(jwtData));
// 			navigate('/');
// 		} catch (err) {
// 			NotificationError(err);
// 		}
// 	};
//
// 	useEffect(() => {
// 		if (location.pathname === 'direct') {
// 			checkToken();
// 		} else if (location.pathname === '/direct/login') {
// 			localStorage.setItem('accessToken', newToken);
// 			navigate('/');
// 		}
// 	}, [newToken]);
//
// 	return <Circle loading={true} />;
// }
