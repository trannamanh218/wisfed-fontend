import { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import QuotesTab from './components/QuotesTab';
import ReviewTab from './components/ReviewTab';
import './book-review.scss';
import { useSelector, useDispatch } from 'react-redux';
import { handleDirectToQuoteTabOfBookDetail } from 'reducers/redux-utils/book';

const BookReview = () => {
	const [currentTab, setCurrentTab] = useState('reviews');
	const { directToQuoteTabOfBookDetail } = useSelector(state => state.book);
	const dispatch = useDispatch();

	useEffect(() => {
		if (directToQuoteTabOfBookDetail) {
			setCurrentTab('quotes');
			dispatch(handleDirectToQuoteTabOfBookDetail(false));
		}
	}, []);

	return (
		<div className='book-review'>
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
