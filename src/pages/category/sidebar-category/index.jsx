import { useFetchFavoriteCategories, useFetchViewMoreCategories } from 'api/category.hook';
import { MAX_PER_PAGE } from 'constants';
import React from 'react';
import { useState } from 'react';
import StatisticList from 'shared/statistic-list';
import TopicColumn from 'shared/topic-column';
import PropTypes from 'prop-types';
import { Circle as CircleLoading } from 'shared/loading';
import { STATUS_LOADING } from 'constants';
import './sidebar-category.scss';

const SidebarCategory = ({ status, viewCategoryDetail }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const {
		categoryData: { rows = [], count = 0 },
	} = useFetchViewMoreCategories(currentPage, MAX_PER_PAGE, '[]');

	const handleViewMore = () => {
		if (rows.length < count) {
			setCurrentPage(prev => prev + 1);
		}
	};

	const { favoriteCategoryData } = useFetchFavoriteCategories();

	return (
		<div className='sidebar-category'>
			<CircleLoading loading={status === STATUS_LOADING} />
			<StatisticList
				title='Chủ đề yêu thích'
				background='light'
				className='sidebar-category__list'
				isBackground={false}
				list={favoriteCategoryData.rows}
			/>
			<TopicColumn
				className='sidebar-category__topics'
				topics={rows}
				title='Tất cả chủ đề'
				handleViewMore={handleViewMore}
				viewCategoryDetail={viewCategoryDetail}
			/>
		</div>
	);
};

SidebarCategory.propTypes = {
	status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	viewCategoryDetail: PropTypes.func,
};

export default SidebarCategory;
