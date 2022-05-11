import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { generateQuery } from 'helpers/Common';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookDetail, getBookList, getBookAuthorList } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';

export const useFetchBooks = (current = 1, perPage = 10, filter = '[]') => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [books, setBooks] = useState({
		rows: [],
		count: 0,
	});
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(() => {
		const isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);
			const query = generateQuery(current, perPage, filter);
			const fetchData = async () => {
				try {
					const data = await dispatch(getBookList(query)).unwrap();
					setBooks(data.rows);
				} catch (err) {
					NotificationError(err);
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			};

			fetchData();
		}
	}, [retry, current, perPage, filter]);

	return { status, books, retryRequest };
};

export const useFetchAuthorBooks = (firstName, lastName) => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const [booksAuthor, setBooksAuthor] = useState([]);
	const [retry, setRetry] = useState(false);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(() => {
		const isMount = true;
		if (isMount) {
			setStatus(STATUS_LOADING);
			const query = generateQuery(
				0,
				10,
				JSON.stringify([{ 'operator': 'search', 'value': `${firstName}`, 'property': 'authorName' }])
			);
			const fetchData = async () => {
				try {
					const data = await dispatch(getBookAuthorList(query)).unwrap();
					setBooksAuthor(data);
				} catch (err) {
					NotificationError(err);
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			};

			fetchData();
		}
	}, [retry, firstName, lastName]);

	return { status, booksAuthor, retryRequest };
};

export const useFetchBookDetail = id => {
	const {
		book: { bookInfo },
		auth: { userInfo },
	} = useSelector(state => state);
	const [status, setStatus] = useState(STATUS_IDLE);
	const dispatch = useDispatch();

	useEffect(() => {
		let isMount = true;
		setStatus(STATUS_LOADING);
		const fetchBookDetail = async () => {
			const params = { id, userId: userInfo.id };

			try {
				await dispatch(getBookDetail(params)).unwrap();
				setStatus(STATUS_SUCCESS);
			} catch (err) {
				NotificationError(err);
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		};

		if (isMount) {
			fetchBookDetail();
		}

		return () => {
			isMount = false;
		};
	}, [id]);
	return { bookInfo, status };
};

export const useFetchRelatedBooks = categoryId => {
	const [retry, setRetry] = useState(false);
	const [status, setStatus] = useState(STATUS_IDLE);
	const [relatedBooks, setRelatedBooks] = useState([]);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(() => {
		let isMount = true;

		if (categoryId && isMount) {
			const query = generateQuery(
				0,
				10,
				JSON.stringify([{ 'operator': 'eq', 'value': categoryId, 'property': 'categoryId' }])
			);

			const fetchBook = async () => {
				try {
					const response = await dispatch(getBookList(query)).unwrap();
					setRelatedBooks(response.rows);
					setStatus(STATUS_SUCCESS);
				} catch (err) {
					NotificationError(err);
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			};

			fetchBook();
		}

		return () => {
			isMount = false;
		};
	}, [categoryId, retry]);

	return { relatedBooks, status, retryRequest };
};
