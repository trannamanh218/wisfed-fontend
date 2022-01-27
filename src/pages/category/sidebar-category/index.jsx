import React from 'react';
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

	const topicList = Array.from(Array(45)).map((_, index) => ({
		name: `Kinh doanh ${index}`,
	}));

	return (
		<div className='sidebar-category'>
			<StatisticList
				title='Chủ đề yêu thích'
				background='light'
				className='sidebar-category__list'
				isBackground={false}
				list={statisticList}
			/>
			<TopicColumn className='sidebar-category__topics' topics={topicList} title='Tất cả chủ đề' />
		</div>
	);
};

SidebarCategory.propTypes = {};

export default SidebarCategory;
