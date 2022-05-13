import MyShelvesList from 'shared/my-shelves-list';
import StatisticList from 'shared/statistic-list';
import ToggleList from 'shared/toggle-list';
import './sidebar-quote.scss';
import { useSelector } from 'react-redux';

const SidebarQuote = () => {
	const hashtagList = [
		{ id: 1, title: 'Tiểu thuyết' },
		{ id: 2, title: 'Hạnh phúc' },
		{ id: 3, title: 'Đầu tư' },
		{ id: 4, title: 'Kinh doanh' },
		{ id: 4, title: 'Kinh doanh' },
		{ id: 4, title: 'Kinh doanh' },
		{ id: 4, title: 'Kinh doanh' },
	];

	const myAllLibrary = useSelector(state => state.library.myAllLibrary);

	return (
		<div className='sidebar-my-quote'>
			<ToggleList list={hashtagList} title='Hashtag từ Quotes' />
			<StatisticList
				className='sidebar-my-quote__reading__status'
				title='Trạng thái đọc'
				background='light'
				isBackground={true}
				list={myAllLibrary.default}
				pageText={false}
			/>
			<MyShelvesList list={myAllLibrary.custom} />
		</div>
	);
};

export default SidebarQuote;
