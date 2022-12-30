import { STATUS_SUCCESS } from 'constants/index';
import { STATUS_IDLE } from 'constants/index';
import { STATUS_LOADING } from 'constants/index';
import { generateQuery } from 'helpers/Common';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuoteList } from 'reducers/redux-utils/quote';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

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
		try {
			const res = await dispatch(getQuoteList()).unwrap();
			const data = res.rows;
			if (data && data.length > 0) {
				const item = data[Math.floor(Math.random() * data.length)];
				setQuoteRandom(item);
			}
			setStatus(STATUS_SUCCESS);
		} catch (err) {
			NotificationError(err);
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		}
	}, [retry]);

	return { status, quoteRandom, retryRequest };
};

export const useFetchQuotes = (current = 0, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [quoteData, setQuoteData] = useState([]);
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);
			const query = generateQuery(current, perPage, filter);

			if (!_.isEmpty(userInfo)) {
				try {
					const data = await dispatch(getQuoteList(query)).unwrap();
					setQuoteData(data.rows);
					setStatus(STATUS_SUCCESS);
				} catch (err) {
					NotificationError(err);
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			}
		}

		return () => {
			isMount = false;
		};
	}, [retry, current, perPage, filter, userInfo]);

	return { status, quoteData, retryRequest };
};

export const useFetchQuotesByCategory = (categoryId = '', limit = 10) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [listQuotesByCategory, setListQuotesByCategory] = useState([]);
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);
			const query = {
				categoryId: categoryId,
				limit: limit,
			};
			if (categoryId) {
				try {
					const data = await dispatch(getQuoteList(query)).unwrap();
					setListQuotesByCategory(data.rows);
					setStatus(STATUS_SUCCESS);
				} catch (err) {
					NotificationError(err);
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			}
		}
		return () => {
			isMount = false;
		};
	}, [retry, categoryId, limit]);

	return { status, listQuotesByCategory, retryRequest };
};
