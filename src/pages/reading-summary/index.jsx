import MainContainer from 'components/layout/main-container';
import NotFound from 'pages/not-found';
import { useEffect, useState } from 'react';
import MainReadingSummary from './main-reading-summary';
import SidebarReadingSummary from './sidebar-reading-summary';

const ReadingSummary = () => {
	const [errorLoadPage, setErrorLoadPage] = useState(false);
	useEffect(() => {
		window.scroll(0, 0);
	}, []);

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
