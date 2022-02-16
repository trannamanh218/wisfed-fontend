import { STATUS_LOADING } from 'constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getGroupList } from 'reducers/redux-utils/group';

export const useFetchGroups = () => {
	const [status, setStatus] = useState('idle');
	const [groups, setGroups] = useState({});
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		setStatus(STATUS_LOADING);

		async function fetchData() {
			try {
				const data = await dispatch(getGroupList()).unwrap();
				setGroups(data);
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		}

		fetchData();
	}, [retry]);

	return { status, groups, retryRequest };
};
