import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { generateQuery } from 'helpers/Common';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserList } from 'reducers/redux-utils/user';

export const useFetchUsers = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [usersData, setUsersData] = useState({ rows: [], count: 0 });
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		setStatus(STATUS_LOADING);
		const query = generateQuery(current, perPage, filter);

		async function fetchData() {
			try {
				const data = await dispatch(getUserList(query)).unwrap();
				setUsersData(data);
				setStatus(STATUS_SUCCESS);
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		}

		fetchData();
	}, [retry, current, perPage, filter]);

	return { status, usersData, retryRequest };
};
