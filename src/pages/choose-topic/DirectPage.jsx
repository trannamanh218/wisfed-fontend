import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Circle from 'shared/loading/circle';
import Request from 'helpers/Request';
import Storage from 'helpers/Storage';

export default function Direct() {
	const search = useSearchParams();
	const newToken = search[0].get('token');
	const navigate = useNavigate();

	useEffect(() => {
		if (newToken) {
			Request.setToken(newToken);
			Storage.setAccessToken(newToken);
			navigate('/');
		}
	}, [newToken]);

	return <Circle loading={true} />;
}
