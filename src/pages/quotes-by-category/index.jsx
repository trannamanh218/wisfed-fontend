import MainContainer from 'components/layout/main-container';
import MainQuotesByCategory from './main-quotes-by-category';
import SidebarQuote from 'shared/sidebar-quote';

const QuotesByCategory = () => {
	return (
		<MainContainer
			main={<MainQuotesByCategory />}
			right={<SidebarQuote inMyQuote={false} hasCountQuotes={true} />}
		/>
	);
};

export default QuotesByCategory;
