import { useEffect, useState } from 'react';
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
	const [listRatingStar, setListRatingStar] = useState({});

	const listRating = [
		{
			level: 5,
			percent:
				(listRatingStar.rate_5_star / listRatingStar.count) * 100
					? (listRatingStar.rate_5_star / listRatingStar.count).toFixed(2) * 100
					: 0,
			total: listRatingStar.rate_5_star,
		},
		{
			level: 4,
			percent:
				(listRatingStar.rate_4_star / listRatingStar.count) * 100
					? (listRatingStar.rate_4_star / listRatingStar.count).toFixed(2) * 100
					: 0,
			total: listRatingStar.rate_4_star,
		},
		{
			level: 3,
			percent:
				(listRatingStar.rate_3_star / listRatingStar.count) * 100
					? (listRatingStar.rate_3_star / listRatingStar.count).toFixed(2) * 100
					: 0,
			total: listRatingStar.rate_3_star,
		},
		{
			level: 2,
			percent:
				(listRatingStar.rate_2_star / listRatingStar.count) * 100
					? (listRatingStar.rate_2_star / listRatingStar.count).toFixed(2) * 100
					: 0,
			total: listRatingStar.rate_2_star,
		},
		{
			level: 1,
			percent:
				(listRatingStar.rate_1_star / listRatingStar.count) * 100
					? (listRatingStar.rate_1_star / listRatingStar.count).toFixed(2) * 100
					: 0,
			total: listRatingStar.rate_1_star,
		},
	];

	const fetchData = async () => {
		try {
			const res = await dispatch(getRatingBook(bookInfor?.id)).unwrap();
			setListRatingStar(res.data);
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
				ratingLevel={listRatingStar?.avg}
				ratingTotal={listRatingStar?.count}
				className='book-review__rating'
			/>
			<Tabs className='book-review__tabs'>
				<Tab eventKey='review' title='Reviews'>
					<ReviewTab />
				</Tab>
				<Tab eventKey='quotes' title='Quotes'>
					<QuotesTab />
				</Tab>
			</Tabs>
		</div>
	);
};

export default BookReview;
