import { STATUS_LOADING } from 'constants';
import { STATUS_IDLE } from 'constants';
import { parsedQueryString } from 'helpers/Common';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getActivityList } from 'reducers/redux-utils/activity';

export const useFetchActivities = (query = '', isNewPost) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [activity, setActivity] = useState([]);
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		setStatus(STATUS_LOADING);

		async function fetchData() {
			const queryObj = parsedQueryString(query);
			try {
				const data = await dispatch(getActivityList(queryObj)).unwrap();
				setActivity(data);
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		}

		fetchData();
	}, [retry, query, isNewPost]);

	return { status, activity, retryRequest };
};
