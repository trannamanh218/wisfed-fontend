import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getlistQuotesLikedById, getQuoteList } from 'reducers/redux-utils/quote';
import LoadingIndicator from 'shared/loading-indicator';
import QuoteList from 'shared/quote-list';

const QuoteTab = ({ currentTab, currentUserInfo }) => {
	const [myQuoteList, setMyQuoteList] = useState([]);
	const [myFavoriteQuoteList, setMyFavoriteQuoteList] = useState([]);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const { userId } = useParams();

	const userInfo = useSelector(state => state.auth.userInfo);

	const callApiStart = useRef(0);

	useEffect(() => {
		if (currentTab === 'quotes') {
			getMyQuoteList();
			getMyFavoriteQuoteList();
		}
	}, [currentTab, userId]);

	const getMyQuoteList = async () => {
		setLoading(true);
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
		} finally {
			setLoading(false);
		}
	};

	const getMyFavoriteQuoteList = async () => {
		setLoading(true);
		try {
			const data = {
				params: {
					start: callApiStart.current,
					sort: JSON.stringify([{ 'property': 'createdAt', 'direction': 'DESC' }]),
				},
				userId: userId,
			};
			const res = await dispatch(getlistQuotesLikedById(data)).unwrap();
			setMyFavoriteQuoteList(res);
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoading(false);
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

						{loading ? (
							<LoadingIndicator />
						) : (
							<QuoteList list={myQuoteList} userId={userId} type='myQuotes' />
						)}
					</div>
					<div className='favorite-quotes'>
						<h4>Quote yêu thích</h4>
						{loading ? <LoadingIndicator /> : <QuoteList list={myFavoriteQuoteList} userId={userId} />}
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
