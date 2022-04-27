import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListBooksTargetReading } from 'reducers/redux-utils/chart';
import { NotificationError } from 'helpers/Error';

export const useFetchTargetReading = (userId, modalOpen, deleteModal, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [booksReadYear, setBooksReadYear] = useState([]);
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
				filter,
			};
			const fetchData = async () => {
				const params = {
					userId: userId,
					...query,
				};

				try {
					if (userId) {
						const data = await dispatch(getListBooksTargetReading(params)).unwrap();
						const dob = new Date();
						const year = dob.getFullYear();
						const newData = data.filter(item => item.year === year);
						setBooksReadYear(newData);
						setStatus(STATUS_SUCCESS);
					}
				} catch (err) {
					NotificationError(err);
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			};

			fetchData();
		}
		return () => {
			isMount = false;
		};
	}, [retry, modalOpen, deleteModal, userId, filter]);

	return { status, booksReadYear, retryRequest };
};
