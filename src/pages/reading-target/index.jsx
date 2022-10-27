import MainContainer from 'components/layout/main-container';
import NotFound from 'pages/not-found';
import { useState } from 'react';
import MainReadingTarget from './main-reading-target';
import SidebarReadingTarget from './sidebar-reading-target';

const ReadingTarget = () => {
	const [errorLoadPage, setErrorLoadPage] = useState(false);

	return (
		<>
			{!errorLoadPage ? (
				<MainContainer
					main={<MainReadingTarget setErrorLoadPage={setErrorLoadPage} />}
					right={<SidebarReadingTarget />}
				/>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default ReadingTarget;
