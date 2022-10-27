import MainContainer from 'components/layout/main-container';
import MainBooksAuthor from './main-books-author';
import SidebarBooksAuthor from './sidebar-books-author';
import { useParams } from 'react-router-dom';
import { handleShelvesGroup } from 'api/shelvesGroup.hooks';
import Circle from 'shared/loading/circle';
import { useEffect } from 'react';
import NotFound from 'pages/not-found';

const BooksAuthor = () => {
	const { userId } = useParams();

	const { isLoading, shelveGroupName, isMine, allLibrary } = handleShelvesGroup(userId);

	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	return (
		<>
			<Circle loading={isLoading} />
			{shelveGroupName ? (
				<MainContainer
					main={<MainBooksAuthor shelveGroupName={`Sách của ${shelveGroupName}`} />}
					right={
						<SidebarBooksAuthor shelveGroupName={shelveGroupName} isMine={isMine} allLibrary={allLibrary} />
					}
				/>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default BooksAuthor;
