import { useEffect, useState } from 'react';
import QuoteList from 'shared/quote-list';
import { getQuoteList, getMyLikedQuotes } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';

const QuoteTab = () => {
	const [myQuoteList, setMyQuoteList] = useState([]);
	const [myFavoriteQuoteList, setMyFavoriteQuoteList] = useState([]);

	const dispatch = useDispatch();
	const { userId } = useParams();

	useEffect(() => {
		getMyQuoteList();
		getMyFavoriteQuoteList();
	}, []);

	const getMyQuoteList = async () => {
		try {
			const params = {
				start: 0,
				limit: 3,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'eq', value: userId, property: 'createdBy' }]),
			};
			const quotesList = await dispatch(getQuoteList(params)).unwrap();
			setMyQuoteList(quotesList);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getMyFavoriteQuoteList = async () => {
		try {
			const params = {
				start: 0,
				limit: 3,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const res = await dispatch(getMyLikedQuotes(params)).unwrap();
			const quoteList = [];
			res.forEach(item => quoteList.push({ ...item, categories: [], tags: [] }));
			setMyFavoriteQuoteList(quoteList);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<>
			<div className='my-quotes'>
				<h4>Quote của tôi</h4>
				<QuoteList list={myQuoteList} />
			</div>
			<div className='favorite-quotes'>
				<h4>Quote yêu thích</h4>
				<QuoteList list={myFavoriteQuoteList} />
			</div>
		</>
	);
};

QuoteTab.propTypes = {};

export default QuoteTab;
