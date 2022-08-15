import _ from 'lodash';
import { useCallback, useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryGroup from 'shared/category-group';
import LoadingIndicator from 'shared/loading-indicator';
import SearchCategory from './SearchCategory';
// import { STATUS_LOADING } from 'constants';
import Circle from 'shared/loading/circle';
import SearchIcon from 'assets/icons/search.svg';
import PropTypes from 'prop-types';
import './main-category.scss';
import { getCategoryList } from 'reducers/redux-utils/category';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

const MainCategory = ({ isFetching, handleViewBookDetail, handleViewCategoryDetail }) => {
	const [inputValue, setInputValue] = useState('');
	const [filter, setFilter] = useState('[]');

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
			const params = { start: 0, limit: callApiPerPage.current, filter: filter };
			const categoryListData = await dispatch(getCategoryList({ option: true, params })).unwrap();
			setCategoryList(categoryListData.rows);
			if (!categoryListData.rows.length || categoryListData.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const getCategoryListData = async () => {
		try {
			const params = { start: callApiStart.current, limit: callApiPerPage.current, filter: filter };
			const categoryListData = await dispatch(getCategoryList({ option: true, params })).unwrap();
			if (categoryListData.rows.length) {
				if (categoryListData.rows.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setCategoryList(categoryList.concat(categoryListData.rows));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const updateFilter = value => {
		if (value) {
			const filterValue = [{ 'operator': 'search', 'value': value.trim(), 'property': 'name' }];
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
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
				{filter === '[]' ? (
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
							/>
						))}
					</InfiniteScroll>
				) : (
					<SearchCategory
						searchCategories={categoryList}
						fetchFilterData={getCategoryListData}
						hasMoreFilterData={hasMore}
						handleViewBookDetail={handleViewBookDetail}
						handleViewCategoryDetail={handleViewCategoryDetail}
						inputValue={inputValue}
					/>
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
