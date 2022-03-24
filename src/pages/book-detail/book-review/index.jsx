import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewRating from 'shared/review-rating';
import QuotesTab from './components/QuotesTab';
import ReviewTab from './components/ReviewTab';
import './book-review.scss';

const BookReview = () => {
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
			<ReviewRating list={listRating} ratingLevel={4.2} ratingTotal={3200} className='book-review__rating' />
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
