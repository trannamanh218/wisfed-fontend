import MyShelvesList from 'shared/my-shelves-list';
import StatisticList from 'shared/statistic-list';
import ToggleList from 'shared/toggle-list';
import './sidebar-quote.scss';

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

	const statusList = [
		{ name: 'Muốn đọc', quantity: 30 },
		{ name: 'Đang đọc', quantity: 110 },
		{ name: 'Đã đọc', quantity: 8 },
	];

	const shelfList = [
		{ name: 'giasach2021', quantity: 30 },
		{ name: 'sach cua toi', quantity: 110 },
		{ name: 'tu sanch thang 1', quantity: 8 },
		{ name: 'tu sanch thang 2', quantity: 8 },
		{ name: 'tu sanch thang 3', quantity: 8 },
	];

	return (
		<div className='sidebar-my-quote'>
			<ToggleList list={hashtagList} title='Hashtag từ Quotes' />
			<StatisticList
				className='sidebar-my-quote__reading__status'
				title='Trạng thái đọc'
				background='light'
				isBackground={true}
				list={statusList}
			/>
			<MyShelvesList list={shelfList} />
		</div>
	);
};

export default SidebarQuote;
