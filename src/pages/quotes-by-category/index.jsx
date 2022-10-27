import MainContainer from 'components/layout/main-container';
import MainQuotesByCategory from './main-quotes-by-category';
import SidebarQuote from 'shared/sidebar-quote';
import { useState } from 'react';
import NotFound from 'pages/not-found';

const QuotesByCategory = () => {
	const [errorLoadPage, setErrorLoadPage] = useState(false);

	return (
		<>
			{!errorLoadPage ? (
				<MainContainer
					main={<MainQuotesByCategory setErrorLoadPage={setErrorLoadPage} />}
					right={<SidebarQuote inMyQuote={false} hasCountQuotes={true} />}
				/>
			) : (
				<NotFound />
			)}
		</>
	);
};

export default QuotesByCategory;
