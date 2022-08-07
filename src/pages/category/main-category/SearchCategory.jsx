import PropTypes from 'prop-types';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryGroup from 'shared/category-group';

const SearchCategory = ({
	searchCategories,
	fetchFilterData,
	hasMoreFilterData,
	handleViewBookDetail,
	handleViewCategoryDetail,
	inputValue,
}) => {
	if (searchCategories.length) {
		return (
			<div className='search-category'>
				<h5>Kết quả tìm kiếm cho "{inputValue}"</h5>
				<InfiniteScroll
					dataLength={searchCategories.length}
					next={fetchFilterData}
					hasMore={hasMoreFilterData}
					loader={<LoadingIndicator />}
				>
					{searchCategories.map(category => {
						if (category?.books.length) {
							return (
								<CategoryGroup
									key={`category-group-${category.id}`}
									list={category.books}
									title={category.name}
									data={category}
									handleViewBookDetail={handleViewBookDetail}
									handleViewCategoryDetail={handleViewCategoryDetail}
								/>
							);
						}
					})}
				</InfiniteScroll>
			</div>
		);
	}
	return <p className='blank-content'>Không có kết quả phù hợp</p>;
};
SearchCategory.defaultProps = {
	searchCategories: [],
	fetchFilterData: () => {},
	handleViewBookDetail: () => {},
	hasMoreFilterData: true,
	handleViewCategoryDetail: () => {},
	inputSearch: '',
};
SearchCategory.propTypes = {
	searchCategories: PropTypes.array,
	fetchFilterData: PropTypes.func,
	handleViewBookDetail: PropTypes.func,
	hasMoreFilterData: PropTypes.bool,
	handleViewCategoryDetail: PropTypes.func,
	inputSearch: PropTypes.string,
};
export default SearchCategory;
