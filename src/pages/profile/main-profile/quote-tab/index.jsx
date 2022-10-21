import { useEffect, useState, memo } from 'react';
import QuoteList from 'shared/quote-list';
import { getQuoteList, getMyLikedQuotes, getlistQuotesLikedById } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useRef } from 'react';

const QuoteTab = ({ currentTab, currentUserInfo }) => {
	const [myQuoteList, setMyQuoteList] = useState([]);
	const [myFavoriteQuoteList, setMyFavoriteQuoteList] = useState([]);

	const dispatch = useDispatch();
	const { userId } = useParams();

	const userInfo = useSelector(state => state.auth.userInfo);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(3);

	useEffect(() => {
		if (currentTab === 'quotes') {
			getMyQuoteList();
			getMyFavoriteQuoteList();
		}
	}, [currentTab, userId]);

	const getMyQuoteList = async () => {
		try {
			const params = {
				start: 0,
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
			const data = {
				params: {
					start: callApiStart.current,
					// limit: callApiPerPage.current,
					sort: JSON.stringify([{ 'property': 'createdAt', 'direction': 'DESC' }]),
				},
				userId: userId,
			};
			const res = await dispatch(getlistQuotesLikedById(data)).unwrap();
			setMyFavoriteQuoteList(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<>
			{currentTab === 'quotes' && (
				<>
					<div className='my-quotes'>
						{userId === userInfo.id ? (
							<h4>Quote của tôi</h4>
						) : (
							<h4>
								Quote của{' '}
								{currentUserInfo.fullName
									? currentUserInfo.fullName
									: currentUserInfo.firstName + '' + currentUserInfo.lastName}
							</h4>
						)}

						<QuoteList list={myQuoteList} userId={userId} type='myQuotes' />
					</div>
					<div className='favorite-quotes'>
						<h4>Quote yêu thích</h4>
						<QuoteList list={myFavoriteQuoteList} userId={userId} />
					</div>
				</>
			)}
		</>
	);
};

QuoteTab.propTypes = {
	currentTab: PropTypes.string,
	currentUserInfo: PropTypes.object,
};

export default memo(QuoteTab);
