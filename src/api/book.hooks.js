import { STATUS_IDLE, STATUS_LOADING, STATUS_SUCCESS } from 'constants';
import { generateQuery } from 'helpers/Common';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookDetail, getBookList, getReviewOfBook } from 'reducers/redux-utils/book';
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

export const useFetchBookDetail = id => {
	const {
		book: { bookInfo = {} },
		auth: { userInfo = {} },
	} = useSelector(state => state);
	const [status, setStatus] = useState(STATUS_IDLE);
	const dispatch = useDispatch();

	useEffect(() => {
		let isMount = true;

		const fetchBookDetail = async () => {
			const params = { id, userId: userInfo.id };

			try {
				await dispatch(getBookDetail(params)).unwrap();
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
	}, [id, userInfo]);

	return { bookInfo, status };
};

export const useFetchReviewOfBook = (id, option, current = 1, perPage = 10, filter) => {
	const [retry, setRetry] = useState(false);
	const [status, setStatus] = useState(STATUS_IDLE);
	const [reviewData, setReviewData] = useState({
		rows: [],
		count: 0,
	});
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(() => {
		let isMount = true;

		if (id) {
			const query = generateQuery(current, perPage, filter);
			const params = {
				id,
				...query,
				option,
			};

			setStatus(STATUS_LOADING);
			const fetchReview = async () => {
				try {
					const res = await dispatch(getReviewOfBook(params)).unwrap();
					setStatus(STATUS_SUCCESS);
					setReviewData(res);
				} catch (err) {
					NotificationError(err);
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			};

			if (isMount) {
				fetchReview();
			}
		}
		return () => {
			isMount = false;
		};
	}, [id, option, current, perPage, filter, retry]);

	return { reviewData, status, retryRequest };
};

export const useFetchRelatedBooks = categoryId => {
	const [retry, setRetry] = useState(false);
	const [status, setStatus] = useState(STATUS_IDLE);
	const [relatedBook, setRelatedBook] = useState([]);
	const dispatch = useDispatch();

	const retryRequest = useCallback(() => {
		setRetry(prev => !prev);
	}, [setRetry]);

	useEffect(() => {
		let isMount = true;

		if (categoryId && isMount) {
			const query = generateQuery(
				1,
				10,
				JSON.stringify([{ 'operator': 'eq', 'value': categoryId, 'property': 'categoryId' }])
			);

			const fetchBook = async () => {
				try {
					const response = await dispatch(getBookList(query)).unwrap();
					setRelatedBook(response.rows);
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

	return { relatedBook, status, retryRequest };
};
