import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryGroup from 'shared/category-group';
const SearchCategory = ({ searchCategories, fetchFilterData, hasMoreFilterData, handleViewBookDetail }) => {
	if (searchCategories.length) {
		return (
			<InfiniteScroll
				dataLength={searchCategories.length}
				next={fetchFilterData}
				hasMore={hasMoreFilterData}
				loader={<LoadingIndicator />}
				pullDownToRefreshThreshold={50}
			>
				{searchCategories.map(item => (
					<>
						<div key={item.id} className='form-check-wrapper'>
							{searchCategories.map(category => (
								<CategoryGroup
									key={`category-group-${category.id}`}
									list={category.books}
									title={category.name}
									handleViewBookDetail={handleViewBookDetail}
								/>
							))}
						</div>
					</>
				))}{' '}
			</InfiniteScroll>
		);
	}
	return <p className='blank-content'>Không có kết quả phù hợp</p>;
};
SearchCategory.defaultProps = {
	searchCategories: [],
	fetchFilterData: () => {},
	handleViewBookDetail: () => {},
	hasMoreFilterData: true,
};
SearchCategory.propTypes = {
	searchCategories: PropTypes.array,
	fetchFilterData: PropTypes.func,
	handleViewBookDetail: PropTypes.func,
	hasMoreFilterData: PropTypes.bool,
};
export default SearchCategory;
