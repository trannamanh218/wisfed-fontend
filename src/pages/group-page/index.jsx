import MainContainer from 'components/layout/main-container';
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
			<h2>Hashtag</h2>
			<SearchField placeholder='Tìm kiếm hashtag' />
			{/* <StatisticList title='' list={list} /> */}
		</div>
	);

	return (
		<div className='group__main-container'>
			<MainContainer main={<MainGroup />} right={<SidebarGroup />} />
		</div>
	);
};

export default Group;
