import MainContainer from 'components/layout/main-container';
import { useState, useEffect, useCallback } from 'react';
import MainShelves from './main-shelves';
import SidebarShelves from './sidebar-shelves';
import Circle from 'shared/loading/circle';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetail } from 'reducers/redux-utils/user';
import _ from 'lodash';
import { NotificationError } from 'helpers/Error';
import { getAllLibraryList } from 'reducers/redux-utils/library';
import { getBookDetail } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';

const BookShelves = () => {
	const [allLibraryList, setAllLibraryList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [shelveName, setShelveName] = useState('');
	const [isMyShelve, setIsMyShelve] = useState();
	const [otherUserData, setOtherUserData] = useState({});

	const { userId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userInfo = useSelector(state => state.auth.userInfo);
	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	useEffect(async () => {
		if (!_.isEmpty(userInfo)) {
			if (userId !== userInfo.id) {
				setIsLoading(true);
				const user = await dispatch(getUserDetail(userId)).unwrap();
				setOtherUserData(user);
				setShelveName(`Tủ sách của ${user.fullName}`);
				setIsMyShelve(false);
				getAllLibrary();
			} else {
				setIsMyShelve(true);
				setShelveName('Tủ sách của tôi');
			}
		}
	}, [userInfo, userId]);

	useEffect(() => {
		if (isMyShelve && !_.isEmpty(myAllLibraryRedux)) {
			setAllLibraryList(myAllLibraryRedux.default.concat(myAllLibraryRedux.custom));
		}
	}, [isMyShelve, myAllLibraryRedux]);

	const getAllLibrary = async () => {
		try {
			const data = await dispatch(getAllLibraryList({ userId })).unwrap();
			const newData = data.default.concat(data.custom);
			setAllLibraryList(newData);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleViewBookDetail = useCallback(async data => {
		setIsLoading(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setIsLoading(false);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	}, []);

	return (
		<>
			<Circle loading={isLoading} />
			<MainContainer
				main={
					<MainShelves
						allLibraryList={allLibraryList}
						shelveName={shelveName}
						isMyShelve={isMyShelve}
						handleViewBookDetail={handleViewBookDetail}
					/>
				}
				right={
					<SidebarShelves
						userData={otherUserData}
						isMyShelve={isMyShelve}
						handleViewBookDetail={handleViewBookDetail}
					/>
				}
			/>
		</>
	);
};

export default BookShelves;
