import React from 'react';
import { Link } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import MyShelvesList from 'shared/my-shelves-list';
import QuotesLinks from 'shared/quote-links';
import ReadChallenge from 'shared/read-challenge';
import StatisticList from 'shared/statistic-list';
import PropTypes from 'prop-types';
import './sidebar-shelves.scss';
import { useSelector } from 'react-redux';

const SidebarShelves = () => {
	const { libraryData } = useSelector(state => state.library);
	const libraryList = libraryData.rows.map(item => ({ ...item, quantity: item.books.length }));

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

	return (
		<div className='sidebar-shelves'>
			<StatisticList
				className='sidebar-shelves__reading__status'
				title='Trạng thái đọc'
				background='light'
				isBackground={true}
				list={statusList}
			/>
			<MyShelvesList list={libraryList} />
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

SidebarShelves.propTypes = {
	libraryData: PropTypes.array,
};

export default SidebarShelves;
