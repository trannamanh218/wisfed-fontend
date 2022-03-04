import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getLibraryList } from 'reducers/redux-utils/library';

export const useFetchLibraries = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
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
					await dispatch(getLibraryList()).unwrap();
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

	return { status, retryRequest };
};
