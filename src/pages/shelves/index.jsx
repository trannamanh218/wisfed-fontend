import MainContainer from 'components/layout/main-container';
import { useState, useEffect, useCallback } from 'react';
import MainShelves from './main-shelves';
import SidebarShelves from './sidebar-shelves';
import Circle from 'shared/loading/circle';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { NotificationError } from 'helpers/Error';
import { getAllLibraryList } from 'reducers/redux-utils/library';
import { getBookDetail } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';
import { handleShelvesGroup } from 'api/shelvesGroup.hooks';

const BookShelves = () => {
	const [allLibraryList, setAllLibraryList] = useState([]);
	const [isViewBookDetailLoading, setIsViewBookDetailLoading] = useState(false);

	const { userId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userInfo = useSelector(state => state.auth.userInfo);
	const myAllLibraryRedux = useSelector(state => state.library.myAllLibrary);

	const { isLoading, shelveGroupName, isMine } = handleShelvesGroup(userId);

	useEffect(() => {
		if (!_.isEmpty(userInfo) && userId !== userInfo.id) {
			getAllLibrary();
		}
	}, [userInfo, userId]);

	useEffect(() => {
		if (isMine && !_.isEmpty(myAllLibraryRedux)) {
			setAllLibraryList(myAllLibraryRedux.default.concat(myAllLibraryRedux.custom));
		}
	}, [isMine, myAllLibraryRedux]);

	const getAllLibrary = async () => {
		try {
			const data = await dispatch(getAllLibraryList({ userId })).unwrap();
			const newData = data.default.concat(data.custom);
			setAllLibraryList(newData);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleViewBookDetail = useCallback(async data => {
		setIsViewBookDetailLoading(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setIsViewBookDetailLoading(false);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	}, []);

	return (
		<>
			<Circle loading={isLoading || isViewBookDetailLoading} />
			<MainContainer
				main={
					shelveGroupName && (
						<MainShelves
							allLibraryList={allLibraryList}
							shelveGroupName={`Tủ sách của ${shelveGroupName}`}
							isMyShelve={isMine}
							handleViewBookDetail={handleViewBookDetail}
						/>
					)
				}
				right={
					<SidebarShelves
						shelveGroupName={shelveGroupName}
						isMyShelve={isMine}
						handleViewBookDetail={handleViewBookDetail}
					/>
				}
			/>
		</>
	);
};

export default BookShelves;
