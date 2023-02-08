import MainContainer from 'components/layout/main-container';
import NotFound from 'pages/not-found';
import { useState } from 'react';
import MainReadingSummary from './main-reading-summary';
import SidebarReadingSummary from './sidebar-reading-summary';

const ReadingSummary = () => {
	const [errorLoadPage, setErrorLoadPage] = useState(false);

	return (
		<>
			{!errorLoadPage ? (
				<MainContainer
					main={<MainReadingSummary setErrorLoadPage={setErrorLoadPage} />}
					right={<SidebarReadingSummary />}
				/>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default ReadingSummary;
