import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getGroupList } from 'reducers/redux-utils/group';

export const useFetchGroups = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [groups, setGroups] = useState({ rows: [], count: 0 });
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);

			const fetchData = async () => {
				try {
					const data = await dispatch(getGroupList()).unwrap();
					setGroups(data);
					setStatus(STATUS_SUCCESS);
				} catch (err) {
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			};

			fetchData();
		}
		return () => {
			isMount = false;
		};
	}, [retry, current, perPage, filter]);

	return { status, groups, retryRequest };
};
