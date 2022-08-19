import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getCheckJwt, updateLoginExternal } from 'reducers/redux-utils/auth';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';
import { NotificationError } from 'helpers/Error';
import axios from 'axios';
import { updateUserInfo } from 'reducers/redux-utils/auth';

export default function Direct() {
	const search = useSearchParams();
	const newToken = search[0].get('token');
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getJwt = async () => {
		try {
			// const jwtData = await axios.get('https://wisfeed.tecinus.vn/api/v1/auth/jwt', {
			// 	headers: { Authorization: `Bearer ${newToken}` },
			// });
			// dispatch(updateUserInfo(jwtData));

			await dispatch(getCheckJwt()).unwrap();
			navigate('/');
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		if (newToken) {
			localStorage.setItem('accessToken', newToken);
			const accessToken = localStorage.getItem('accessToken');
			if (accessToken) {
				dispatch(updateLoginExternal(true));
				getJwt();
			}
		}
	}, [newToken]);

	return <Circle loading={true} />;
}
