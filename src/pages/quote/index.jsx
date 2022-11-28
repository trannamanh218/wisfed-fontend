import MainContainer from 'components/layout/main-container';
import MainQuote from './main-quote';
import NotFound from 'pages/not-found';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getListHasgTagByUser } from 'reducers/redux-utils/quote';
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

	const getDataHasgTagByUser = async () => {
		try {
			const params = {
				filter: JSON.stringify([{ 'operator': 'eq', 'value': userId, 'property': 'createdBy' }]),
				sort: JSON.stringify([{ 'direction': 'DESC', 'property': 'createdAt' }]),
			};
			const res = await dispatch(getListHasgTagByUser(params)).unwrap();
			setListHashtag(res.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		getDataHasgTagByUser();
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
