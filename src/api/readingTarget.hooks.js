import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants/index';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListBooksTargetReading, setMyTargetReading } from 'reducers/redux-utils/chart';
import { useSelector } from 'react-redux';

export const useFetchTargetReading = (userIdParams, modalOpen) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [booksReadYear, setBooksReadYear] = useState([]);

	const dispatch = useDispatch();

	const { userInfo } = useSelector(state => state.auth);
	const { myTargetReading } = useSelector(state => state.chart);
	const resetMyTargetReading = useSelector(state => state.chart.resetMyTargetReading);

	const dob = new Date();
	const year = dob.getFullYear();

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);
			const fetchData = async () => {
				try {
					if (userIdParams) {
						let newData = [];
						if (userInfo.id === userIdParams) {
							if (myTargetReading.length) {
								newData = [...myTargetReading];
							} else {
								const data = await dispatch(getListBooksTargetReading(userIdParams)).unwrap();
								newData = data.filter(item => item.year === year);
								dispatch(setMyTargetReading(newData));
							}
						} else {
							const data = await dispatch(getListBooksTargetReading(userIdParams)).unwrap();
							newData = data.filter(item => item.year === year);
						}
						setBooksReadYear(newData);
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
	}, [userIdParams, modalOpen, resetMyTargetReading]);

	return { status, booksReadYear, setBooksReadYear, year };
};
