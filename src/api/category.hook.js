import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCategoryList } from 'reducers/redux-utils/category';

export const useFetchCategories = (filter, sort, page = 5, current = 1) => {
	const [categories, setCategories] = useState();
	const [pagination, setPagination] = useState({ current: 1, perPage: 5 });
	const [hasMore, setHasMore] = useState(true);
	const dispatch = useDispatch();

	const fetchData = () => {
		const { current, perPage } = pagination;
		const query = {
			start: current > 1 ? (current - 1) * perPage : 0,
			limit: perPage,
			sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			filter: JSON.stringify([]),
		};

		return dispatch(getCategoryList(query)).unwrap();
	};

	useEffect(() => {
		fetchData
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
	}, [filter, sort]);
};
