import MainContainer from 'components/layout/main-container';
import MainAllQuotes from '../main-all-quote';
import SidebarQuote from 'shared/sidebar-quote';

const QuoteAll = () => {
	return <MainContainer main={<MainAllQuotes />} right={<SidebarQuote />} />;
};

export default QuoteAll;
