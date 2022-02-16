import { STATUS_LOADING } from 'constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getQuoteList } from 'reducers/redux-utils/quote';

export const useFetchQuoteRandom = () => {
	const [status, setStatus] = useState('idle');
	const [quoteRandom, setQuoteRandom] = useState({});
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		setStatus(STATUS_LOADING);

		async function fetchData() {
			try {
				const data = await dispatch(getQuoteList()).unwrap();
				if (data.rows && data.rows.length) {
					setQuoteRandom(data.rows[0]);
				}
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		}

		fetchData();
	}, [retry]);

	return { status, quoteRandom, retryRequest };
};
