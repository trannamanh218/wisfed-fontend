import { useEffect, useState } from 'react';
import QuoteList from 'shared/quote-list';
import { getQuoteList } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const QuoteTab = () => {
	const [myQuoteList, setMyQuoteList] = useState([]);
	const [myFavoriteQuoteList, setMyFavoriteQuoteList] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		getMyQuoteList();
	}, []);

	const getMyQuoteList = async () => {
		try {
			const params = {
				start: 0,
				limit: 3,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([
					{ operator: 'eq', value: 'bfdb3971-de4c-4c2b-bbbe-fbb36770031a', property: 'createdBy' },
				]),
			};
			const quotesList = await dispatch(getQuoteList(params)).unwrap();
			setMyQuoteList(myQuoteList.concat(quotesList));
		} catch {
			toast.error('Lỗi hệ thống');
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
