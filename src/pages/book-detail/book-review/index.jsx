import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ReviewRating from 'shared/review-rating';
import QuotesTab from './components/QuotesTab';
import ReviewTab from './components/ReviewTab';
import './book-review.scss';
import { useSelector, useDispatch } from 'react-redux';
import { handleDirectToQuoteTabOfBookDetail } from 'reducers/redux-utils/book';

const BookReview = ({ listRatingStar }) => {
	const [currentTab, setCurrentTab] = useState('reviews');
	const { directToQuoteTabOfBookDetail } = useSelector(state => state.book);
	const dispatch = useDispatch();

	useEffect(() => {
		if (directToQuoteTabOfBookDetail) {
			setCurrentTab('quotes');
			dispatch(handleDirectToQuoteTabOfBookDetail(false));
		}
	}, []);

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

	return (
		<div className='book-review'>
			<ReviewRating
				list={listRating}
				ratingLevel={listRatingStar?.avg}
				ratingTotal={listRatingStar?.count}
				className='book-review__rating'
			/>
			<Tabs className='book-review__tabs' activeKey={currentTab} onSelect={activeKey => setCurrentTab(activeKey)}>
				<Tab eventKey='reviews' title='Reviews'>
					<ReviewTab currentTab={currentTab} />
				</Tab>
				<Tab eventKey='quotes' title='Quotes'>
					<QuotesTab currentTab={currentTab} />
				</Tab>
			</Tabs>
		</div>
	);
};

export default BookReview;

BookReview.propTypes = {
	bookInfo: PropTypes.object,
	listRatingStar: PropTypes.object,
};
