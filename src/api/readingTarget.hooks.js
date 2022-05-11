import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListBooksTargetReading, updateTargetReading } from 'reducers/redux-utils/chart';
import { NotificationError } from 'helpers/Error';
import { useSelector } from 'react-redux';

export const useFetchTargetReading = (userId, modalOpen, deleteModal, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const { targetReading } = useSelector(state => state.chart);
	const [booksReadYear, setBooksReadYear] = useState([]);
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
						const dob = new Date();
						const year = dob.getFullYear();
						if (targetReading.length > 0 && userInfo.id === userId) {
							dispatch(updateTargetReading([]));
							const newData = targetReading.filter(item => item.year === year);
							setBooksReadYear(newData);
							setStatus(STATUS_SUCCESS);
						} else {
							dispatch(updateTargetReading([]));
							const data = await dispatch(getListBooksTargetReading(params)).unwrap();
							const newData = data.filter(item => item.year === year);
							setBooksReadYear(newData);
							setStatus(STATUS_SUCCESS);
						}
					}
				} catch (err) {
					NotificationError(err);
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
