import { useFetchAllCategoriesWithBooks, useFetchFilterCategories } from 'api/category.hook';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryGroup from 'shared/category-group';
import LoadingIndicator from 'shared/loading-indicator';
import SearchField from 'shared/search-field';
import SearchCategory from './SearchCategory';
import { STATUS_LOADING } from 'constants';
import { Circle as CircleLoading } from 'shared/loading';
import PropTypes from 'prop-types';
import './main-category.scss';

const MainCategory = ({ status, handleViewBookDetail, viewCategoryDetail }) => {
	const [inputValue, setInputValue] = useState('');
	const { categories, fetchData, hasMore } = useFetchAllCategoriesWithBooks();
	const { searchCategories, fetchFilterData, hasMoreFilterData } = useFetchFilterCategories(inputValue);

	const changeHandler = event => {
		setInputValue(event.target.value);
	};

	const debouncedChangeHandler = useCallback(_.debounce(changeHandler, 1000), []);

	return (
		<div className='main-category'>
			<CircleLoading loading={status === STATUS_LOADING} />
			<h4>Tất cả chủ đề</h4>
			<div className='main-category__container'>
				<SearchField placeholder='Tìm kiếm chủ đề' handleChange={debouncedChangeHandler} />
				{!inputValue ? (
					<InfiniteScroll
						dataLength={categories.length}
						next={fetchData}
						hasMore={hasMore}
						loader={<LoadingIndicator />}
					>
						{categories.map(category => (
							<CategoryGroup
								key={`category-group-${category.id}`}
								list={category.books}
								title={category.name}
								data={category}
								handleViewBookDetail={handleViewBookDetail}
								handleClick={viewCategoryDetail}
							/>
						))}
					</InfiniteScroll>
				) : (
					<SearchCategory
						searchCategories={searchCategories}
						fetchFilterData={fetchFilterData}
						hasMoreFilterData={hasMoreFilterData}
						handleViewBookDetail={handleViewBookDetail}
					/>
				)}
			</div>
		</div>
	);
};

MainCategory.propTypes = {
	status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	viewCategoryDetail: PropTypes.func,
	handleViewBookDetail: PropTypes.func,
};

export default MainCategory;
