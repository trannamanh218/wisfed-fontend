import { STATUS_BOOK } from 'constants';
import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { generateQuery } from 'helpers/Common';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	getAllBookInLirary,
	getLibraryList,
	getMyLibraryList,
	updateAuthLibrary,
	updateLibrary,
} from 'reducers/redux-utils/library';

export const useFetchLibraries = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();
	const { libraryData } = useSelector(state => state.library);

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(() => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);

			const fetchData = async () => {
				if (filter !== '[]') {
					const query = generateQuery(1, 10, filter);

					try {
						const data = await dispatch(getLibraryList(query)).unwrap();
						dispatch(updateLibrary(data));
						setStatus(STATUS_SUCCESS);
					} catch (err) {
						const statusCode = err?.statusCode || 500;
						setStatus(statusCode);
					}
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

export const useFetchStatsReadingBooks = isUpdate => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [retry, setRetry] = useState(false);
	const { userInfo } = useSelector(state => state.auth);
	const [readingData, setReadingData] = useState([
		{ name: 'Muốn đọc', value: STATUS_BOOK.wantToRead, quantity: 0 },
		{ name: 'Đang đọc', value: STATUS_BOOK.reading, quantity: 0 },
		{ name: 'Đã đọc', value: STATUS_BOOK.read, quantity: 0 },
	]);
	const dispatch = useDispatch();
	const params = useParams();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);

			const filter = [{ 'operator': 'eq', 'value': true, 'property': 'isDefault' }];

			if (_.isEmpty(params)) {
				filter.push({ 'operator': 'eq', 'value': userInfo.id, 'property': 'createdBy' });
			} else {
				filter.push({ 'operator': 'eq', 'value': params.id, 'property': 'createdBy' });
			}

			const fetchData = async () => {
				try {
					const query = generateQuery(1, 10, JSON.stringify(filter));
					const data = await dispatch(getLibraryList(query)).unwrap();
					const { rows = [] } = data;

					const libraryList = readingData.map(item => {
						const library = rows.find(library => library.defaultType === item.value);
						if (library) {
							return { ...item, quantity: library.books.length };
						}
						return { ...item, quantity: 0 };
					});

					setReadingData(libraryList);
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
	}, [retry, userInfo, params, isUpdate]);

	return { status, retryRequest, readingData };
};

export const useFetchFilterBookFromLibrary = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [retry, setRetry] = useState(false);
	const [books, setBooks] = useState({
		rows: [],
		count: 0,
	});
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
					const data = await dispatch(getAllBookInLirary(query)).unwrap();
					setBooks(data);
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

	return { status, retryRequest, books };
};

export const useFetchMyLibraries = (current = 1, perPage = 10, isUpdate) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);
	const params = useParams();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		let isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);

			const fetchData = async () => {
				try {
					const filter = [{ 'operator': 'eq', 'value': false, 'property': 'isDefault' }];

					if (_.isEmpty(params)) {
						filter.push({ 'operator': 'eq', 'value': userInfo.id, 'property': 'createdBy' });
					} else {
						filter.push({ 'operator': 'eq', 'value': params.userId, 'property': 'createdBy' });
					}

					const query = generateQuery(1, 10, JSON.stringify(filter));
					const data = await dispatch(getLibraryList(query)).unwrap();

					dispatch(updateLibrary(data));
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
	}, [retry, current, perPage, userInfo, params, isUpdate]);

	return { status, retryRequest };
};

export const useFetchAuthLibraries = (current = 1, perPage = 10) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [retry, setRetry] = useState(false);
	const [statusLibraries, setStatusLibraries] = useState([]);
	const { userInfo } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(async () => {
		let isMount = true;
		if (isMount && !_.isEmpty(userInfo)) {
			setStatus(STATUS_LOADING);

			const fetchData = async () => {
				try {
					const data = await dispatch(getMyLibraryList()).unwrap();
					const { rows } = data;

					dispatch(updateAuthLibrary({ rows: rows.custom, count: rows.custom.length }));
					setStatusLibraries(rows.default);
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
	}, [retry, current, perPage, userInfo]);

	return { status, retryRequest, statusLibraries };
};

export const useFetchBookInDefaultLibrary = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState();
	const [bookData, setBookData] = useState([]);
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(() => {
		let isMount = true;
		const fetchLibrary = async () => {
			const query = generateQuery(current, perPage, filter);
			try {
				const data = await dispatch(getMyLibraryList(query)).unwrap();
				const { rows, count } = data;
				if (count > 0 && isMount) {
					const { default: defaultLibraries } = rows;
					const currentLibrary = defaultLibraries[0];
					const bookData = !_.isEmpty(currentLibrary)
						? currentLibrary.books.map(item => ({ ...item.book }))
						: [];
					setBookData(bookData);
					setStatus(STATUS_SUCCESS);
				}
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		};

		fetchLibrary();

		return () => {
			isMount = false;
		};
	}, [current, perPage, filter, retry]);

	return { status, bookData, retryRequest };
};
