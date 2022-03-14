import { STATUS_BOOK } from 'constants';
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { generateQuery } from 'helpers/Common';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getLibraryList, getListBookLibrary } from 'reducers/redux-utils/library';

export const useFetchLibraries = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();
	const { libraryData } = useSelector(state => state.library);

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);

			const fetchData = async () => {
				const query = generateQuery(1, 10, filter);

				try {
					await dispatch(getLibraryList({ ...query, isAuth: true })).unwrap();
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

	return { status, retryRequest, libraryData };
};

export const useFetchStatsReadingBooks = () => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [retry, setRetry] = useState(false);
	const [readingData, setReadingData] = useState([
		{ name: 'Muốn đọc', value: STATUS_BOOK.liked, quantity: 0 },
		{ name: 'Đang đọc', value: STATUS_BOOK.reading, quantity: 0 },
		{ name: 'Đã đọc', value: STATUS_BOOK.read, quantity: 0 },
	]);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	const createQuery = status => {
		const filter = JSON.stringify([
			{ 'operator': 'eq', 'value': 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a', 'property': 'updatedBy' },
			{ 'operator': 'eq', 'value': status, 'property': 'status' },
		]);
		return generateQuery(1, 10, filter);
	};

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);

			const fetchData = async () => {
				const queryLikeBook = createQuery('like');
				const queryReadingBook = createQuery('reading');
				const queryReadBook = createQuery(STATUS_BOOK.read);

				const likedBookRequest = dispatch(getListBookLibrary(queryLikeBook)).unwrap();
				const readingBookRequest = dispatch(getListBookLibrary(queryReadingBook)).unwrap();
				const readBookRequest = dispatch(getListBookLibrary(queryReadBook)).unwrap();

				Promise.all([likedBookRequest, readingBookRequest, readBookRequest])
					.then(res => {
						setReadingData([
							{ name: 'Muốn đọc', value: 'like', quantity: res[0].count },
							{ name: 'Đang đọc', value: STATUS_BOOK.reading, quantity: res[1].count },
							{ name: 'Đã đọc', value: STATUS_BOOK.read, quantity: res[2].count },
						]);

						setStatus(STATUS_SUCCESS);
					})
					.catch(err => {
						const statusCode = err?.statusCode || 500;
						setStatus(statusCode);
					});
			};

			fetchData();
		}
		return () => {
			isMount = false;
		};
	}, [retry]);

	return { status, retryRequest, readingData };
};

export const useFetchFilterBookFromLibrary = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [retry, setRetry] = useState(false);
	const params = useParams();
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);

			const fetchData = async () => {
				const query = generateQuery(1, 10, filter);

				try {
					await dispatch(getLibraryList(query)).unwrap();
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

	return { status, retryRequest };
};
