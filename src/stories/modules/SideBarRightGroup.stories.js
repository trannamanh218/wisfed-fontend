import { useState } from 'react';
import SearchField from 'shared/search-field';
import StatisticList from 'shared/statistic-list';

const [inputSearch, setInputSearch] = useState('');

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
		<div style={{ width: 300 }}>
			<SearchField
				placeholder='Tìm kiếm hashtag'
				value={inputSearch}
				handleChange={e => setInputSearch(e.target.value)}
			/>
		</div>

		<StatisticList title='' list={list} />
	</div>
);

export default {
	title: 'Components/Modules/SidebarGroupRight',
	component: SidebarGroup,
};

const Template = args => <SidebarGroup {...args} />;

export const Default = Template.bind({});
