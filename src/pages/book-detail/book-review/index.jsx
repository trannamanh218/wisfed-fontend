import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewRating from 'shared/review-rating';
import QuotesTab from './components/QuotesTab';
import ReviewTab from './components/ReviewTab';
import './book-review.scss';
import { getRatingBook } from 'reducers/redux-utils/book';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const BookReview = () => {
	const bookInfor = useSelector(state => state.book.bookInfo);
	const dispatch = useDispatch();
	const [listRatingStar, setListRatingStar] = useState(null);

	const listRating = [
		{
			level: 5,
			percent: 40,
			total: 2000,
		},
		{
			level: 4,
			percent: 20,
			total: 2000,
		},
		{
			level: 3,
			percent: 10,
			total: 2000,
		},
		{
			level: 2,
			percent: 28,
			total: 2000,
		},
		{
			level: 1,
			percent: 2,
			total: 2000,
		},
	];

	const fetchData = async () => {
		const query = {
			filter: JSON.stringify([{ 'operator': 'eq', 'value': `${bookInfor.id}`, 'property': 'bookId' }]),
		};
		try {
			const res = await dispatch(getRatingBook(query)).unwrap();
			const data = res.data.rows;
			setListRatingStar(data);
		} catch (err) {
			toast.error('lỗi hệ thống');
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const listQuote = Array.from(Array(5)).fill({
		data: {
			content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam velit nemo voluptate. Eaque tenetur
			dolore qui doloribus modi alias labore deleniti quisquam sunt. Accusantium, accusamus eius ipsum optio
			distinctio laborum.`,
			avatar: '',
			author: 'Mai Nguyễn',
			bookName: 'Đắc nhân tâm',
		},
		badges: [{ title: 'Marketing' }, { title: 'Phát triển bản thân' }],
	});

	return (
		<div className='book-review'>
			<ReviewRating
				list={listRating}
				ratingLevel={4.2}
				ratingTotal={listRatingStar?.length}
				className='book-review__rating'
			/>
			<Tabs className='book-review__tabs'>
				<Tab eventKey='review' title='Reviews'>
					<ReviewTab />
				</Tab>
				<Tab eventKey='quotes' title='Quotes'>
					<QuotesTab list={listQuote} />
				</Tab>
			</Tabs>
		</div>
	);
};

export default BookReview;
