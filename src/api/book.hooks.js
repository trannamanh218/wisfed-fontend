import { STATUS_IDLE } from 'constants';
import { STATUS_LOADING } from 'constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getBookList } from 'reducers/redux-utils/book';

export const useFetchBooks = ({ query = '' }) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [books, setBooks] = useState({});
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		setStatus(STATUS_LOADING);

		async function fetchData() {
			try {
				const data = await dispatch(getBookList(query)).unwrap();
				setBooks(data.rows);
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		}

		fetchData();
	}, [retry, query]);

	return { status, books, retryRequest };
};
