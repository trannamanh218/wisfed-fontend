import _ from 'lodash';
import { useCallback, useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryGroup from 'shared/category-group';
import LoadingIndicator from 'shared/loading-indicator';
import SearchCategory from './SearchCategory';
import Circle from 'shared/loading/circle';
import SearchIcon from 'assets/icons/search.svg';
import PropTypes from 'prop-types';
import './main-category.scss';
import { getCategoryList } from 'reducers/redux-utils/category';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getFilterSearch } from 'reducers/redux-utils/search';

const MainCategory = ({ isFetching, handleViewBookDetail, handleViewCategoryDetail }) => {
	const [inputValue, setInputValue] = useState('');
	const [filter, setFilter] = useState([{ 'operator': 'ne', 'value': 0, 'property': 'numberBooks' }]);

	const [categoryList, setCategoryList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(3);
	const callApiPerPage = useRef(3);

	const dispatch = useDispatch();

	useEffect(() => {
		setHasMore(true);
		callApiStart.current = 3;
		getCategoryListDataFirstTime();
	}, [filter]);

	const getCategoryListDataFirstTime = async () => {
		try {
			let categoryListData = [];
			// Nếu ô tìm kiếm trống thì dùng api cũ, nếu có gõ tìm kiếm thì dùng elastic search
			if (filter[0].operator) {
				const params = {
					start: 0,
					limit: callApiPerPage.current,
					filter: JSON.stringify(filter),
				};
				const fetch = await dispatch(getCategoryList({ option: true, params })).unwrap();
				categoryListData = fetch.rows;
			} else {
				const params = {
					q: filter,
					start: 0,
					limit: callApiPerPage.current,
					type: 'categories',
					must_not: { 'numberBook': '0' },
				};
				const fetch = await dispatch(getFilterSearch(params)).unwrap();
				categoryListData = fetch.rows;
			}
			setCategoryList(categoryListData);
			if (categoryListData.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getCategoryListData = async () => {
		try {
			let categoryListData = [];
			if (filter[0].operator) {
				const params = {
					start: callApiStart.current,
					limit: callApiPerPage.current,
					filter: JSON.stringify(filter),
				};
				const fetch = await dispatch(getCategoryList({ option: true, params })).unwrap();
				categoryListData = fetch.rows;
			} else {
				const params = {
					q: filter,
					type: 'categories',
					start: callApiStart.current,
					limit: callApiPerPage.current,
					must_not: { 'numberBook': '0' },
				};
				const fetch = await dispatch(getFilterSearch(params)).unwrap();
				categoryListData = fetch.rows;
			}
			if (categoryListData.length) {
				if (categoryListData.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setCategoryList(categoryList.concat(categoryListData));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const updateFilter = value => {
		if (value) {
			setFilter(value.trim());
		} else {
			setFilter([{ 'operator': 'ne', 'value': 0, 'property': 'numberBooks' }]);
		}
	};

	const updateInputSearch = event => {
		setInputValue(event.target.value);
		debounceSearch(event.target.value);
	};

	const debounceSearch = useCallback(_.debounce(updateFilter, 700), []);

	return (
		<div className='main-category'>
			<Circle loading={isFetching} />
			<h4>Tất cả chủ đề</h4>
			<div className='main-category__container'>
				<div className='search-field'>
					<img className='search-field__icon' src={SearchIcon} alt='search-icon' />
					<input className='search-field__input' placeholder='Tìm kiếm chủ đề' onChange={updateInputSearch} />
				</div>
				{inputValue.length > 0 ? (
					<SearchCategory
						searchCategories={categoryList}
						fetchFilterData={getCategoryListData}
						hasMoreFilterData={hasMore}
						handleViewBookDetail={handleViewBookDetail}
						handleViewCategoryDetail={handleViewCategoryDetail}
						inputValue={inputValue}
					/>
				) : (
					<InfiniteScroll
						dataLength={categoryList.length}
						next={getCategoryListData}
						hasMore={hasMore}
						loader={<LoadingIndicator />}
					>
						{categoryList.map(category => (
							<CategoryGroup
								key={`category-group-${category.id}`}
								list={category.books}
								title={category.name}
								data={category}
								handleViewBookDetail={handleViewBookDetail}
								handleViewCategoryDetail={handleViewCategoryDetail}
								inCategory={true}
							/>
						))}
					</InfiniteScroll>
				)}
			</div>
		</div>
	);
};

MainCategory.propTypes = {
	isFetching: PropTypes.bool,
	handleViewCategoryDetail: PropTypes.func,
	handleViewBookDetail: PropTypes.func,
};

export default MainCategory;
