import { STATUS_SUCCESS, STATUS_IDLE } from 'constants';
import { generateQuery } from 'helpers/Common';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getBookList } from 'reducers/redux-utils/book';
import { getCategoryDetail, getCategoryList } from 'reducers/redux-utils/category';
import { usePrevious } from 'shared/hooks';

const fetchCategories = async (dispatch, pagination, filter = []) => {
	const { current, perPage } = pagination;
	const query = generateQuery(current, perPage, JSON.stringify(filter));
	const data = await dispatch(getCategoryList(query)).unwrap();
	return data;
};

const fetchBook = (id, dispatch) => {
	const query = generateQuery(1, 10, JSON.stringify([{ 'operator': 'eq', 'value': id, 'property': 'categoryId' }]));
	return dispatch(getBookList(query)).unwrap();
};

export const useFetchViewMoreCategories = (current = 0, perPage = 10, filter = '[]') => {
	const [categoryData, setCategoryData] = useState({
		rows: [],
		count: 0,
	});
	const [status, setStatus] = useState(STATUS_IDLE);
	const dispatch = useDispatch();

	useEffect(() => {
		const getCategories = async () => {
			const query = generateQuery();
			try {
				const data = await dispatch(getCategoryList(query)).unwrap();
				const { rows, count } = data;
				if (categoryData.rows.length < count) {
					setCategoryData(prev => ({ rows: [...prev.rows, ...rows], count }));
				}
				setStatus(STATUS_SUCCESS);
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
			}
		};

		getCategories();
	}, [current, perPage, filter]);

	const generateQuery = () => {
		return {
			start: current > 1 ? (current - 1) * perPage : 0,
			limit: perPage,
			sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			filter,
		};
	};

	return { categoryData, status };
};

export const useFetchAllCategoriesWithBooks = () => {
	const [pagination, setPagination] = useState({ current: 1, perPage: 3 });
	const [hasMore, setHasMore] = useState(true);
	const [categories, setCategories] = useState([]);
	const [status, setStatus] = useState(STATUS_IDLE);
	const dispatch = useDispatch();

	useEffect(() => {
		const getCategories = async () => {
			try {
				const data = await fetchCategories(dispatch, pagination);
				const { rows: list } = data;

				if (list && list.length) {
					const topBookListRequest = list.map(category => fetchBook(category.id, dispatch));
					Promise.all(topBookListRequest)
						.then(res => {
							const lengthResponse = res.length;
							for (let i = 0; i < lengthResponse; i++) {
								list[i].books = res[i].rows;
							}

							setCategories(list);
							setPagination(prev => ({ ...prev, current: prev.current + 1 }));
							setStatus(STATUS_SUCCESS);
						})
						.catch(err => {
							handleError(err);
						});
				}
			} catch (err) {
				const statusCode = err?.statusCode || 500;
				setStatus(statusCode);
				setHasMore(false);
				toast.error('Lỗi không truy cập được danh sách chủ đề');
				return err;
			}
		};

		getCategories();
	}, []);

	const fetchData = async () => {
		try {
			const data = await fetchCategories(dispatch, pagination);
			const { rows } = data;

			if (rows && rows.length) {
				const topBookListRequest = rows.map(category => fetchBook(category.id, dispatch));
				Promise.all(topBookListRequest)
					.then(res => {
						const lengthResponse = res.length;
						for (let i = 0; i < lengthResponse; i++) {
							rows[i].books = res[i].rows;
						}

						const categoryList = [...categories, ...rows];
						setCategories(categoryList);

						if (rows.length === 0 || rows.length < pagination.perPage) {
							setHasMore(false);
						}

						setPagination(prev => ({ ...prev, current: prev.current + 1 }));
					})
					.catch(err => {
						handleError(err);
					});
			}
		} catch (err) {
			handleError(err);
		}
	};

	const handleError = err => {
		const statusCode = err?.statusCode || 500;
		setStatus(statusCode);
		setHasMore(false);
		toast.error('Lỗi không truy cập được danh sách chủ đề');
	};

	return { categories, fetchData, hasMore, status };
};

export const useFetchFilterCategories = inputValue => {
	const [pagination, setPagination] = useState({ current: 1, perPage: 3 });
	const [hasMoreFilterData, setHasMoreFilterData] = useState(true);
	const [searchCategories, setSearchCategories] = useState([]);
	const [newInput, setNewInput] = useState('');
	const [searchStatus, setSearchStatus] = useState(STATUS_IDLE);
	const previousValue = usePrevious(newInput);
	const dispatch = useDispatch();

	useEffect(() => {
		if (inputValue) {
			setNewInput(inputValue);
			setSearchCategories([]);
			setPagination({ current: 1, perPage: 3 });
			setHasMoreFilterData(true);
		}
	}, [inputValue]);

	useEffect(() => {
		if (newInput !== previousValue && newInput) {
			const getCategories = async () => {
				const filter = [{ 'operator': 'search', 'value': newInput, 'property': 'name' }];
				const pagination = { current: 1, perPage: 3 };
				try {
					const data = await fetchCategories(dispatch, pagination, filter);
					const { rows: list } = data;
					if (list && list.length) {
						const topBookListRequest = list.map(category => fetchBook(category.id, dispatch));

						Promise.all(topBookListRequest)
							.then(res => {
								const lengthResponse = res.length;
								for (let i = 0; i < lengthResponse; i++) {
									list[i].books = res[i].rows;
								}

								setSearchCategories([...list]);
								setPagination(prev => ({ ...prev, current: 2 }));
								setSearchStatus(STATUS_SUCCESS);
							})
							.catch(err => {
								handleError(err);
							});
					} else {
						setSearchCategories(list);
						setPagination({ current: 1, perPage: 3 });
						setHasMoreFilterData(true);
					}

					if (list.length === 0 || list.length < pagination.perPage) {
						setHasMoreFilterData(false);
					}
				} catch (err) {
					handleError(err);
				}
			};
			getCategories();
		}
	}, [newInput]);

	const fetchFilterData = async () => {
		if (newInput) {
			const filter = [{ 'operator': 'search', 'value': newInput, 'property': 'name' }];

			try {
				const data = await fetchCategories(dispatch, pagination, filter);
				const { rows, count } = data;

				if (rows && rows.length) {
					const topBookListRequest = rows.map(category => fetchBook(category.id, dispatch));

					Promise.all(topBookListRequest)
						.then(res => {
							const lengthResponse = res.length;
							for (let i = 0; i < lengthResponse; i++) {
								rows[i].books = res[i].rows;
							}
							let categoryList = [];

							if (rows[lengthResponse - 1].id !== searchCategories[searchCategories.length - 1].id) {
								categoryList = [...searchCategories, ...rows];
								setSearchCategories(categoryList);
							}

							if (
								rows.length === 0 ||
								rows.length < pagination.perPage ||
								categoryList.length === count
							) {
								setHasMoreFilterData(false);
							} else {
								setHasMoreFilterData(true);
							}

							setPagination(prev => ({ ...prev, current: prev.current + 1 }));
						})
						.catch(err => {
							handleError(err);
						});
				}
			} catch (err) {
				handleError(err);
			}
		}
	};

	const handleError = err => {
		const statusCode = err?.statusCode || 500;
		setSearchStatus(statusCode);
		setHasMoreFilterData(false);
		toast.error('Lỗi hệ thống, không tìm được chủ đề');
	};

	return { searchCategories, fetchFilterData, hasMoreFilterData, searchStatus };
};

export const useFetchCategoryDetail = id => {
	const { categoryInfo } = useSelector(state => state.category);
	const [status, setStatus] = useState(STATUS_IDLE);
	const dispatch = useDispatch();

	useEffect(() => {
		let isMount = true;
		if (categoryInfo.id !== id || _.isEmpty(categoryInfo)) {
			const fetchCategoryDetail = async () => {
				try {
					await dispatch(getCategoryDetail(id)).unwrap();
				} catch (err) {
					toast.error('Lỗi hệ thống');
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			};

			if (isMount) {
				fetchCategoryDetail();
			}
		}
		return () => {
			isMount = false;
		};
	}, [id]);

	return { categoryInfo, status };
};

export const useFetchOtherCategories = (current, perPage, name) => {
	const [otherCategories, setOtherCategories] = useState({ rows: [], count: 0 });
	const [status, setStatus] = useState(STATUS_IDLE);
	const [newName, setNewName] = useState('');
	const dispatch = useDispatch();

	const generateQuery = () => {
		return {
			start: current > 1 ? (current - 1) * perPage : 0,
			limit: perPage,
			filter: JSON.stringify([{ 'operator': 'ne', 'value': name, 'property': 'name' }]),
			sort: JSON.stringify([{ 'direction': 'DESC', 'property': 'createdAt' }]),
		};
	};

	useEffect(() => {
		let isMount = true;
		if (isMount) {
			setNewName(name);
			setOtherCategories({ rows: [], count: 0 });
		}
		return () => {
			isMount = false;
		};
	}, [name]);

	useEffect(() => {
		let isMount = true;
		if (newName && isMount) {
			const fetchOtherCategories = async () => {
				const query = generateQuery();
				try {
					const data = await dispatch(getCategoryList(query)).unwrap();
					const { rows, count } = data;
					if (otherCategories.rows.length < count) {
						setOtherCategories({ rows: [...otherCategories.rows, ...rows], count });
					}
					setStatus(STATUS_SUCCESS);
				} catch (err) {
					const statusCode = err?.statusCode || 500;
					setStatus(statusCode);
				}
			};

			fetchOtherCategories();
		}

		return () => {
			isMount = false;
		};
	}, [current, perPage, newName]);

	return { otherCategories, status };
};
