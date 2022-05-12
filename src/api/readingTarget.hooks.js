import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListBooksTargetReading, updateTargetReading, checkRenderTargetReading } from 'reducers/redux-utils/chart';
import { useSelector } from 'react-redux';

export const useFetchTargetReading = (userId, modalOpen, deleteModal, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const { targetReading, renderTarget } = useSelector(state => state.chart);
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
						let newData = [];
						if (targetReading.length > 0 && userInfo.id === userId) {
							dispatch(updateTargetReading([]));
							newData = targetReading.filter(item => item.year === year);
						} else {
							dispatch(updateTargetReading([]));
							const data = await dispatch(getListBooksTargetReading(params)).unwrap();
							newData = data.filter(item => item.year === year);
						}
						if (newData.length > 0) {
							dispatch(checkRenderTargetReading(true));
							setBooksReadYear(newData);
						} else {
							dispatch(checkRenderTargetReading(false));
						}
						setStatus(STATUS_SUCCESS);
					}
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
	}, [retry, modalOpen, deleteModal, userId, filter, renderTarget]);

	return { status, booksReadYear, retryRequest };
};
