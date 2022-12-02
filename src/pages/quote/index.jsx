import MainContainer from 'components/layout/main-container';
import MainQuote from './main-quote';
import NotFound from 'pages/not-found';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { listHashtagsOfUserQuotes } from 'reducers/redux-utils/quote';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidebarQuote from 'shared/sidebar-quote';

const Quote = () => {
	const [listHashtag, setListHashtag] = useState([]);
	const [foundUser, setFoundUser] = useState(true);

	const { userId } = useParams();
	const userInfo = useSelector(state => state.auth.userInfo);
	const dispatch = useDispatch();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const getListHashtagsOfUserQuotes = async () => {
		try {
			const res = await dispatch(listHashtagsOfUserQuotes(userId)).unwrap();
			setListHashtag(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		getListHashtagsOfUserQuotes();
	}, [userId]);

	return (
		<>
			{foundUser ? (
				<MainContainer
					main={<MainQuote setFoundUser={setFoundUser} />}
					right={
						<SidebarQuote
							listHashtags={listHashtag}
							firstStyleQuotesSidebar={userInfo.id === userId}
							createdByOfCurrentQuote={userId}
						/>
					}
				/>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default Quote;
