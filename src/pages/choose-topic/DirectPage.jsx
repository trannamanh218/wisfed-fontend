import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkApiToken } from 'reducers/redux-utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Direct() {
	const search = useSearchParams();
	const newToken = search[0].get('token');
	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		checkToken();
	}, [newToken]);

	return <></>;
}
