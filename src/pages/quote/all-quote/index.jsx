import MainContainer from 'components/layout/main-container';
import React from 'react';
import SidebarQuote from '../sidebar-quote';
import MainAllQuotes from '../main-all-quote';
const QuoteAll = () => {
	return <MainContainer main={<MainAllQuotes />} right={<SidebarQuote />} />;
};

QuoteAll.propTypes = {};

export default QuoteAll;
