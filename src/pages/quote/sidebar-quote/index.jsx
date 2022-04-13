import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookSlider from 'shared/book-slider';
import DualColumn from 'shared/dual-column';
import SearchField from 'shared/search-field';
import './sidebar-quote.scss';

const SidebarQuote = () => {
	const quotesAll = location.pathname === '/quotes/all';
	const [toggleQuotesSlider, setToggleQuesSlider] = useState(true);

	// const hashtagList = [
	// 	{ id: 1, title: 'Tiểu thuyết' },
	// 	{ id: 2, title: 'Hạnh phúc' },
	// 	{ id: 3, title: 'Đầu tư' },
	// 	{ id: 4, title: 'Kinh doanh' },
	// 	{ id: 4, title: 'Kinh doanh' },
	// 	{ id: 4, title: 'Kinh doanh' },
	// 	{ id: 4, title: 'Kinh doanh' },
	// ];

	useEffect(() => {
		if (quotesAll) {
			setToggleQuesSlider(false);
		}
		setTimeout(function () {
			window.scrollTo(0, 0);
		}, 22);
	}, []);

	const quoteList = [
		{ name: 'Tiểu thuyêt', quantity: 30 },
		{ name: 'Hạnh phúc', quantity: 110 },
		{ name: 'Đầu tư', quantity: 8 },
		{ name: 'Kinh doanh', quantity: 8 },
		{ name: 'Tài chính', quantity: 8 },
		{ name: 'Sức khỏẻ', quantity: 8 },
		{ name: 'Sắc đẹp', quantity: 8 },
	];

	const myComposing = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });

	return (
		<div className='sidebar-quote'>
			<div className='sidebar-quote__category'>
				<h4>Danh mục quotes</h4>
				<SearchField className='sidebar-quote__search' placeholder='Tìm kiếm danh mục' />
				<DualColumn list={quoteList} />
			</div>
			{toggleQuotesSlider && (
				<div className='sidebar-quote__slider'>
					<BookSlider title='Sách tôi là tác giả' list={myComposing} />
					<Link className='view-all-link' to='/'>
						Xem thêm
					</Link>
				</div>
			)}
		</div>
	);
};

SidebarQuote.propTypes = {};

export default SidebarQuote;
