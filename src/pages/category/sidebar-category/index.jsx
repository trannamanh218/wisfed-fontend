import { useFetchViewMoreCategories } from 'api/category.hook';
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
	const statisticList = [
		{ name: 'Trinh thám', quantity: 30 },
		{ name: 'Gia đình', quantity: 110 },
		{ name: 'Kinh doanh', quantity: 8 },
		{ name: 'Sức khỏe', quantity: 0 },
		{ name: 'Công nghệ', quantity: 9 },
		{ name: 'Trinh thám', quantity: 30 },
		{ name: 'Gia đình', quantity: 110 },
		{ name: 'Kinh doanh', quantity: 8 },
		{ name: 'Sức khỏe', quantity: 0 },
		{ name: 'Công nghệ', quantity: 9 },
		{ name: 'Trinh thám', quantity: 30 },
		{ name: 'Trinh thám', quantity: 30 },
	];

	const [currentPage, setCurrentPage] = useState(1);
	const {
		categoryData: { rows = [], count = 0 },
	} = useFetchViewMoreCategories(currentPage, MAX_PER_PAGE, '[]');

	const handleViewMore = () => {
		if (rows.length < count) {
			setCurrentPage(prev => prev + 1);
		}
	};

	return (
		<div className='sidebar-category'>
			<CircleLoading loading={status === STATUS_LOADING} />
			<StatisticList
				title='Chủ đề yêu thích'
				background='light'
				className='sidebar-category__list'
				isBackground={false}
				list={statisticList}
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
