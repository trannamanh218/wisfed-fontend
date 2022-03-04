import { useFetchRelatedBooks } from 'api/book.hooks';
import React from 'react';
import { useSelector } from 'react-redux';
import BookSlider from 'shared/book-slider';
import StatisticList from 'shared/statistic-list';
import './book-reference.scss';

const BookReference = () => {
	const { bookInfo } = useSelector(state => state.book);
	const { relatedBook } = useFetchRelatedBooks(bookInfo.categoryId);

	const bookList = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });
	const statisticList = [
		{ name: 'Muốn đọc', quantity: 30 },
		{ name: 'Đang đọc', quantity: 110 },
		{ name: 'Đã đọc', quantity: 8 },
	];

	return (
		<div className='book-reference'>
			{/* sách của tac gia */}
			<BookSlider className='book-reference__slider' title='Sách của Chris' list={bookList} />
			{/* series sách đó */}
			<BookSlider className='book-reference__slider' title='Seris dạy con làm giàu' list={bookList} />
			{/*  */}
			<BookSlider className='book-reference__slider' title='Gợi ý cùng thể loại' list={relatedBook} />

			<h4>Bài viết nổi bật</h4>
			<div className='card card-link book-reference__highlight__post'>
				<ul className='card-link__list'>
					<li className='card-link__item'>
						<a>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</a>
					</li>
					<li className='card-link__item'>
						<a>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</a>
					</li>
					<li className='card-link__item'>
						<a>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</a>
					</li>
					<li className='card-link__item'>
						<a>Cuốn sách fefefegegeegxuất sắc nhất về nuôi dạy con năm 2021</a>
					</li>
				</ul>
			</div>
			<StatisticList title='Trạng thái đọc' background='light' isBackground={false} list={statisticList} />
		</div>
	);
};

BookReference.propTypes = {};

export default BookReference;
