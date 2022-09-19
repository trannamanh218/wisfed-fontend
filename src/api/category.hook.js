import { STATUS_SUCCESS, STATUS_IDLE } from 'constants/index';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCategoryList } from 'reducers/redux-utils/category';
import { NotificationError } from 'helpers/Error';

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
				const data = await dispatch(getCategoryList({ option: false, params: query })).unwrap();
				const { rows, count } = data;
				if (categoryData.rows.length < count) {
					setCategoryData(prev => ({ rows: [...prev.rows, ...rows], count }));
				}
				setStatus(STATUS_SUCCESS);
			} catch (err) {
				NotificationError(err);
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

export const useFetchOtherCategories = (current, perPage, name) => {
	const [otherCategories, setOtherCategories] = useState({ rows: [], count: 0 });
	const [status, setStatus] = useState(STATUS_IDLE);
	const [newName, setNewName] = useState('');
	const dispatch = useDispatch();

	const generateQuery = () => {
		return {
			start: current,
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
					const data = await dispatch(getCategoryList({ option: false, params: query })).unwrap();
					const { rows, count } = data;
					if (otherCategories.rows.length < count) {
						setOtherCategories({ rows: [...otherCategories.rows, ...rows], count });
					}
					setStatus(STATUS_SUCCESS);
				} catch (err) {
					NotificationError(err);
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
