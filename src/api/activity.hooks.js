import { STATUS_SUCCESS } from 'constants';
import { STATUS_LOADING } from 'constants';
import { STATUS_IDLE } from 'constants';
import { generateQuery } from 'helpers/Common';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getActivityList } from 'reducers/redux-utils/activity';

export const useFetchActivities = (current = 1, perPage = 10, filter = '[]', isNewPost) => {
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
			const query = generateQuery(current, perPage, filter);
			try {
				const data = await dispatch(getActivityList(query)).unwrap();
				setActivity(data);

				setStatus(STATUS_SUCCESS);
			} catch (err) {
				console.log(err);
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		}

		fetchData();
	}, [retry, current, perPage, filter, isNewPost]);

	return { status, activity, retryRequest, setActivity };
};
