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

		async function fetchData() {
			try {
				const data = await dispatch(getQuoteList()).unwrap();
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
		}

		fetchData();
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

	useEffect(() => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);
			const query = generateQuery(current, perPage, filter);

			if (!_.isEmpty(userInfo)) {
				const fetchData = async () => {
					try {
						const data = await dispatch(getQuoteList(query)).unwrap();
						setQuoteData(data);
						setStatus(STATUS_SUCCESS);
					} catch (err) {
						NotificationError(err);
						const statusCode = err?.statusCode || 500;
						setStatus(statusCode);
					}
				};
				fetchData();
			}
		}

		return () => {
			isMount = false;
		};
	}, [retry, current, perPage, filter, userInfo]);

	return { status, quoteData, retryRequest };
};
