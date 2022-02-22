import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCategoryList } from 'reducers/redux-utils/category';
import CategoryGroup from 'shared/category-group';
import SearchField from 'shared/search-field';
import InfiniteScroll from 'react-infinite-scroll-component';

import './main-category.scss';
import { getBookList } from 'reducers/redux-utils/book';

const MainCategory = () => {
	const bookList = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });
	const [pagination, setPagination] = useState({ current: 1, perPage: 3 });
	const dispatch = useDispatch();
	const [hasMore, setHasMore] = useState(true);
	const totalCategory = useRef();

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const getCategories = async () => {
			try {
				const data = await fetchCategories();
				const { rows } = data;
				if (rows && rows.length) {
					setCategories(rows);
					setPagination(prev => ({ ...prev, current: prev.current + 1 }));
				}
			} catch (err) {
				return err;
			}
		};

		getCategories();
	}, []);

	const fetchCategories = async () => {
		const { current, perPage } = pagination;
		const query = {
			start: current > 1 ? (current - 1) * perPage : 0,
			limit: perPage,
			sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			filter: JSON.stringify([]),
		};
		const data = await dispatch(getCategoryList(query)).unwrap();
		return data;
	};

	const fetchData = async () => {
		try {
			const data = await fetchCategories();
			const { rows } = data;

			const categoryList = [...categories, ...rows];
			setCategories(categoryList);

			if (rows.length === 0 || rows.length < pagination.perPage) {
				setHasMore(false);
			}

			setPagination(prev => ({ ...prev, current: prev.current + 1 }));
		} catch (err) {
			return;
		}
	};

	// const fetchBook = async id => {
	// 	const query = {
	// 		start: 0,
	// 		limit: 10,
	// 		sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
	// 		filter: JSON.stringify([{ 'operator': 'eq', 'value': id, 'property': 'categoryId' }]),
	// 	};
	// 	const data = await dispatch(getBookList(query));
	// 	return data;
	// };

	// 	const fetchCategories = () => {
	// 		return dispatch(getCategoryList(query))
	// 			.unwrap()
	// 			.then(res => {
	// 				const { count, rows } = res;
	//
	// 				if (!totalCategory.current && count) {
	// 					totalCategory.current = count;
	// 				}
	//
	// 				if (count && length < count) {
	// 					setCategories(prev => [...prev, ...rows]);
	// 					setTimeout(() => {
	// 						if (hasMore) {
	// 							setPagination(prev => ({ ...prev, current: prev.current + 1 }));
	// 						}
	// 					}, 5000);
	// 				} else {
	// 					setHasMore(false);
	// 				}
	// 			})
	// 			.catch(err => {
	// 				console.log(err);
	// 			});
	// 	};

	return (
		<div className='main-category'>
			<h4>Tất cả chủ đề</h4>
			<div className='main-category__container'>
				<SearchField placeholder='Tìm kiếm chủ đề' />
				{/* {[...Array(5)].map((_, index) => (
					<CategoryGroup key={`category-group-${index}`} list={bookList} title={`Tiểu thuyết ${index}`} />
				))} */}
				<InfiniteScroll
					dataLength={categories.length}
					next={fetchData}
					hasMore={hasMore}
					loader={<h4>Loading...</h4>}
				>
					{categories.map((category, index) => (
						<div key={index}>
							{index}-{category.name}
						</div>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
};

MainCategory.propTypes = {};

export default MainCategory;
