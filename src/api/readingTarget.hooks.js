import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListBooksTargetReading, updateTargetReading } from 'reducers/redux-utils/chart';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const useFetchTargetReading = (userIdParams, modalOpen, deleteModal) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const { targetReading, renderTarget, checkRenderTarget } = useSelector(state => state.chart);
	const [booksReadYear, setBooksReadYear] = useState([]);
	const { userId } = useParams();
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const { checkUser } = useSelector(state => state.profile);
	const retryRequest = () => {
		setRetry(!retry);
	};
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
						const newTargetReading = targetReading.filter(item => item.year === year);
						if (
							newTargetReading.length > 0 &&
							userInfo.id === userIdParams &&
							userId &&
							!checkUser &&
							!checkRenderTarget
						) {
							setBooksReadYear(newTargetReading);
						} else {
							dispatch(updateTargetReading([]));
							const data = await dispatch(getListBooksTargetReading(userIdParams)).unwrap();
							newData = data.filter(item => item.year === year);
							setBooksReadYear(newData);
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
	}, [retry, modalOpen, deleteModal, userIdParams, renderTarget, checkRenderTarget]);

	return { status, booksReadYear, retryRequest, setBooksReadYear, year };
};
