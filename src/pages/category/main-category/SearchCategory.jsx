import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryGroup from 'shared/category-group';

const SearchCategory = ({ searchCategories, fetchFilterData, hasMoreFilterData }) => {
	if (searchCategories.length) {
		return (
			<InfiniteScroll
				dataLength={searchCategories.length}
				next={fetchFilterData}
				hasMore={hasMoreFilterData}
				loader={<LoadingIndicator />}
				pullDownToRefreshThreshold={50}
			>
				{searchCategories.map(category => (
					<CategoryGroup key={`category-group-${category.id}`} list={category.books} title={category.name} />
				))}
			</InfiniteScroll>
		);
	}

	return <p className='blank-content'>Không có kết quả phù hợp</p>;
};

SearchCategory.defaultProps = {
	searchCategories: [],
	fetchFilterData: () => {},
	hasMoreFilterData: true,
};

SearchCategory.propTypes = {
	searchCategories: PropTypes.array,
	fetchFilterData: PropTypes.func,
	hasMoreFilterData: PropTypes.bool,
};

export default SearchCategory;
