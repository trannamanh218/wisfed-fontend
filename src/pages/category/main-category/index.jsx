import { useFetchAllCategoriesWithBooks, useFetchFilterCategories } from 'api/category.hook';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryGroup from 'shared/category-group';
import LoadingIndicator from 'shared/loading-indicator';
import SearchCategory from './SearchCategory';
import { STATUS_LOADING } from 'constants';
import Circle from 'shared/loading/circle';
import SearchIcon from 'assets/icons/search.svg';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './main-category.scss';

const MainCategory = ({ status, handleViewBookDetail, viewCategoryDetail }) => {
	const [inputValue, setInputValue] = useState('');
	const { categories, fetchData, hasMore } = useFetchAllCategoriesWithBooks();
	const { searchCategories, fetchFilterData, hasMoreFilterData } = useFetchFilterCategories(inputValue);

	const changeHandler = event => {
		setInputValue(event?.target?.value);
	};

	const debounceSearch = useCallback(_.debounce(changeHandler, 1000), []);

	return (
		<div className='main-category'>
			<Circle loading={status === STATUS_LOADING} />
			<h4>Tất cả chủ đề</h4>
			<div className='main-category__container'>
				<div className={classNames('search-field')}>
					<img className='search-field__icon' src={SearchIcon} alt='search-icon' />
					<input className='search-field__input' placeholder='Tìm kiếm chủ đề' onChange={debounceSearch} />
				</div>
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
