import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';
import Request from 'helpers/Request';
import Storage from 'helpers/Storage';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { checkTokenResetPassword, handleDataToResetPassword } from 'reducers/redux-utils/auth';
import { getCheckJwt } from 'reducers/redux-utils/auth';
import { NotificationError } from 'helpers/Error';

export default function DirectPageDefault() {
	const search = useSearchParams();
	const newToken = search[0].get('token');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const checkToken = async () => {
		try {
			const checkApiTokenAction = await dispatch(checkTokenResetPassword(newToken)).unwrap();
			if (checkApiTokenAction) {
				const dataFromToken = decodeToken(newToken);
				dispatch(handleDataToResetPassword(dataFromToken));
				navigate('/create-newpassword-admin');
			}
		} catch {
			toast.error('Đường dẫn đã hết hạn hoặc không đúng. Vui lòng thử lại');
			navigate('/forget-password-admin');
		}
	};

	function decodeToken(token) {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
		return JSON.parse(jsonPayload);
	}

	useEffect(async () => {
		if (newToken) {
			if (location.pathname.includes('/login')) {
				try {
					Request.setToken(newToken);
					Storage.setAccessToken(newToken);
					const jwtData = await dispatch(getCheckJwt()).unwrap();
					if (!jwtData.favoriteCategory.length) {
						navigate('/choose-topic');
					} else {
						navigate('/');
					}
				} catch (err) {
					NotificationError(err);
				}
			} else {
				checkToken();
			}
		}
	}, [newToken]);

	return <Circle loading={true} />;
}
