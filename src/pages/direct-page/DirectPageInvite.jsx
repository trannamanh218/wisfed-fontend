import Circle from 'shared/loading/circle';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getListContactGoogle } from 'reducers/redux-utils/common';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

export default function DirectPageInvite() {
	const search = useSearchParams();
	const dispatch = useDispatch();

	useEffect(async () => {
		const code = search[0].get('code');

		try {
			const response = await dispatch(getListContactGoogle(code)).unwrap();
			console.log(response);
		} catch (error) {
			NotificationError(error);
		}
	}, []);

	return <Circle loading={true} />;
}
