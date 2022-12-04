import MainContainer from 'components/layout/main-container';
import { useState, useEffect, useCallback } from 'react';
import MainShelves from './main-shelves';
import SidebarShelves from './sidebar-shelves';
import Circle from 'shared/loading/circle';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { getBookDetail } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';
import { handleShelvesGroup } from 'api/shelvesGroup.hooks';
import NotFound from 'pages/not-found';

const BookShelves = () => {
	const [allLibraryList, setAllLibraryList] = useState([]);
	const [isViewBookDetailLoading, setIsViewBookDetailLoading] = useState(false);
	const [renderNotFound, setRenderNotFound] = useState(false);

	const { userId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { shelveGroupName, isMine, allLibrary } = handleShelvesGroup(userId);

	useEffect(() => {
		if (!_.isEmpty(allLibrary)) {
			setAllLibraryList(allLibrary.default.concat(allLibrary.custom));
		}
	}, [allLibrary]);

	const handleViewBookDetail = useCallback(async data => {
		setIsViewBookDetailLoading(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			setRenderNotFound(true);
		} finally {
			setIsViewBookDetailLoading(false);
		}
	}, []);

	return (
		<>
			<Circle loading={isViewBookDetailLoading} />
			{!renderNotFound ? (
				<MainContainer
					main={
						<MainShelves
							allLibraryList={allLibraryList}
							shelveGroupName={`Tủ sách của ${shelveGroupName}`}
							isMyShelve={isMine}
							handleViewBookDetail={handleViewBookDetail}
							setRenderNotFound={setRenderNotFound}
						/>
					}
					right={
						<SidebarShelves
							shelveGroupName={shelveGroupName}
							isMyShelve={isMine}
							handleViewBookDetail={handleViewBookDetail}
							allLibrary={allLibrary}
						/>
					}
				/>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default BookShelves;
