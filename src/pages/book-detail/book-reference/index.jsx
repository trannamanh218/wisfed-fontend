import { useFetchRelatedBooks } from 'api/book.hooks';
import { STATUS_SUCCESS } from 'constants';
import { STATUS_LOADING } from 'constants';
import { STATUS_IDLE } from 'constants';
import RouteLink from 'helpers/RouteLink';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBookDetail } from 'reducers/redux-utils/book';
import BookSlider from 'shared/book-slider';
import StatisticList from 'shared/statistic-list';
import { Circle as CircleLoading } from 'shared/loading';
import './book-reference.scss';
import { NotificationError } from 'helpers/Error';
import { useFetchStatsReadingBooks } from 'api/library.hook';

const BookReference = () => {
	const [status, setStatus] = useState(STATUS_IDLE);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { bookInfo } = useSelector(state => state.book);
	const { relatedBook } = useFetchRelatedBooks(bookInfo.categoryId);
	const { readingData } = useFetchStatsReadingBooks();

	const bookList = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });

	const handleViewBookDetail = async data => {
		setStatus(STATUS_LOADING);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setStatus(STATUS_SUCCESS);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
			const statusCode = err?.statusCode || 500;
			setStatus(statusCode);
		}
	};

	return (
		<div className='book-reference'>
			<CircleLoading loading={status === STATUS_LOADING} />
			{/* sách của tac gia */}
			<BookSlider className='book-reference__slider' title='Sách của Chris' list={bookList} />
			{/* series sách đó */}
			<BookSlider className='book-reference__slider' title='Seris dạy con làm giàu' list={bookList} />
			{/*  */}
			<BookSlider
				className='book-reference__slider'
				title='Gợi ý cùng thể loại'
				list={relatedBook}
				handleViewBookDetail={handleViewBookDetail}
			/>

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
			<StatisticList title='Trạng thái đọc' background='light' isBackground={false} list={readingData} />
		</div>
	);
};

BookReference.propTypes = {};

export default BookReference;
