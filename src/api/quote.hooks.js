import { STATUS_SUCCESS } from 'constants';
import { STATUS_IDLE } from 'constants';
import { STATUS_LOADING } from 'constants';
import { generateQuery } from 'helpers/Common';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getQuoteList } from 'reducers/redux-utils/quote';

export const useFetchQuoteRandom = () => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [quoteRandom, setQuoteRandom] = useState([]);
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
				setStatus(STATUS_SUCCESS);
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		}

		fetchData();
	}, [retry]);

	return { status, quoteRandom, retryRequest };
};

export const useFetchQuotes = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [quoteData, setQuoteData] = useState({ rows: [], count: 0 });
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(() => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);
			const query = generateQuery(current, perPage, filter);

			const fetchData = async () => {
				try {
					const data = await dispatch(getQuoteList(query)).unwrap();
					setQuoteData(data);
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

	return { status, quoteData, retryRequest };
};
