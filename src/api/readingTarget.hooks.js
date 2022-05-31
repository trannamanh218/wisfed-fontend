import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListBooksTargetReading, updateTargetReading, checkRenderTargetReading } from 'reducers/redux-utils/chart';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const useFetchTargetReading = (userIdParams, modalOpen, deleteModal, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const { targetReading, renderTarget } = useSelector(state => state.chart);
	const [booksReadYear, setBooksReadYear] = useState([]);
	const { userId } = useParams();
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const { checkUser } = useSelector(state => state.profile);
	const retryRequest = () => {
		setRetry(!retry);
	};

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);
			const query = {
				filter,
			};
			const fetchData = async () => {
				const params = {
					userId: userIdParams,
					...query,
				};

				try {
					if (userIdParams) {
						const dob = new Date();
						const year = dob.getFullYear();
						let newData = [];
						if (targetReading.length > 0 && userInfo.id === userIdParams && userId && !checkUser) {
							newData = targetReading.filter(item => item.year === year);
							setBooksReadYear(newData);
						} else {
							dispatch(updateTargetReading([]));
							const data = await dispatch(getListBooksTargetReading(params)).unwrap();
							newData = data.filter(item => item.year === year);
							setBooksReadYear(newData);
						}
						if (newData.length > 0) {
							dispatch(checkRenderTargetReading(true));
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
	}, [retry, modalOpen, deleteModal, userIdParams, filter, renderTarget]);

	return { status, booksReadYear, retryRequest };
};
