import MainContainer from 'components/layout/main-container';
import React from 'react';
import SearchField from 'shared/search-field';
import StatisticList from 'shared/statistic-list';
import MainGroup from './MainGroup';

const Group = () => {
	const list = [
		{ name: '#Shadow', quantity: '30 bài viết' },
		{ name: '#GaoRanger', quantity: '30 bài viết' },
		{ name: '#FairyTail', quantity: '30 bài viết' },
		{ name: '#HiềnHồ', quantity: '30 bài viết' },
		{ name: '#Anime', quantity: '30 bài viết' },
	];
	const SidebarGroup = () => (
		<div className='group-sibar-right'>
			<h2>Chủ đề</h2>
			<SearchField placeholder='Tìm kiếm chủ đề' />
			<StatisticList title='' list={list} />
		</div>
	);
	return <MainContainer main={<MainGroup />} right={<SidebarGroup t />} />;
};

export default Group;
