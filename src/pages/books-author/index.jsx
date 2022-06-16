import MainContainer from 'components/layout/main-container';
import MainReadingAuthor from './main-books-author';
import SidebarReadingSummary from '../reading-target/sidebar-reading-target';
import { useParams } from 'react-router-dom';
import { handleShelvesGroup } from 'api/shelvesGroup.hooks';
import Circle from 'shared/loading/circle';
import { useState, useCallback } from 'react';
import { getBookDetail } from 'reducers/redux-utils/book';
import { useNavigate } from 'react-router-dom';
import RouteLink from 'helpers/RouteLink';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';

const BooksAuthor = () => {
	const [isViewBookDetailLoading, setIsViewBookDetailLoading] = useState(false);

	const { userId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isLoading, shelveGroupName, isMine } = handleShelvesGroup(userId);

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
				main={<MainReadingAuthor shelveGroupName={`Sách của ${shelveGroupName}`} />}
				right={
					<SidebarReadingSummary
						shelveGroupName={shelveGroupName}
						isMine={isMine}
						handleViewBookDetail={handleViewBookDetail}
					/>
				}
			/>
		</>
	);
};

export default BooksAuthor;
