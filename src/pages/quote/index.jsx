import MainContainer from 'components/layout/main-container';
import { useEffect, useState } from 'react';
import MainQuote from './main-quote';
import SidebarQuote from 'shared/sidebar-quote';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotFound from 'pages/not-found';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import { getListHasgTagByUser } from 'reducers/redux-utils/quote';

const Quote = () => {
	const [listHashtag, setListHashtag] = useState([]);

	const { userId } = useParams();
	const userInfo = useSelector(state => state.auth.userInfo);
	const dispatch = useDispatch();

	const [foundUser, setFoundUser] = useState(true);

	useEffect(() => {
		setTimeout(function () {
			window.scrollTo(0, 0);
		}, 22);
	});

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
							inMyQuote={userInfo.id === userId}
							hasCountQuotes={true}
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
