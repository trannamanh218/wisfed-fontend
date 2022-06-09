import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkApiToken } from 'reducers/redux-utils/auth';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';

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
			toast.error('Đường dẫn đã hết hạn hoặc không đúng. Vui lòng thử lại');
			navigate('/forget-password-admin');
		}
	};

	useEffect(() => {
		if (location.pathname === 'direct') {
			checkToken();
			setIsFetching(false);
		} else if (location.pathname === '/direct/login') {
			localStorage.setItem('accessToken', newToken);
			setIsFetching(false);
			navigate('/');
		}
	}, [newToken]);

	return (
		<>
			<Circle loading={isFetching} />
		</>
	);
}
