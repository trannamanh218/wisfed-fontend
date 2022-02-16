import React from 'react';
import { Link } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import MyShelvesList from 'shared/my-shelves-list';
import QuotesLinks from 'shared/quote-links';
import ReadChallenge from 'shared/read-challenge';
import StatisticList from 'shared/statistic-list';
import './sidebar-shelves.scss';

const SidebarShelves = () => {
	const statusList = [
		{ name: 'Muốn đọc', quantity: 30 },
		{ name: 'Đang đọc', quantity: 110 },
		{ name: 'Đã đọc', quantity: 8 },
	];

	const quoteList = [...Array(5)].map((_, index) => ({
		author: 'Nguyen Hiến Lê',
		book: 'Đắc nhân tâm',
		content: 'Mỗi trang sách hay đều là một hành trình kỳ diệu',
		id: index,
	}));

	const myComposing = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });

	const shelfList = [
		{ name: 'giasach2021', quantity: 30 },
		{ name: 'sach cua toi', quantity: 110 },
		{ name: 'tu sanch thang 1', quantity: 8 },
		{ name: 'tu sanch thang 2', quantity: 8 },
		{ name: 'tu sanch thang 3', quantity: 8 },
	];

	return (
		<div className='sidebar-shelves'>
			<StatisticList
				className='sidebar-shelves__reading__status'
				title='Trạng thái đọc'
				background='light'
				isBackground={true}
				list={statusList}
			/>
			<MyShelvesList list={shelfList} />
			<QuotesLinks list={quoteList} title='Quotes' />
			<div className='my-compose'>
				<BookSlider title='Sách tôi là tác giả' list={myComposing} />
				<Link className='view-all-link' to='/'>
					Xem thêm
				</Link>
			</div>
			<ReadChallenge />
		</div>
	);
};

SidebarShelves.propTypes = {};

export default SidebarShelves;
