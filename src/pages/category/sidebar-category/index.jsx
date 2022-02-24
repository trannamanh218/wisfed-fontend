import { useFetchViewMoreCategories } from 'api/category.hook';
import { MAX_PER_PAGE } from 'constants';
import React from 'react';
import { useState } from 'react';
import StatisticList from 'shared/statistic-list';
import TopicColumn from 'shared/topic-column';
import './sidebar-category.scss';

const SidebarCategory = () => {
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
			/>
		</div>
	);
};

SidebarCategory.propTypes = {};

export default SidebarCategory;
