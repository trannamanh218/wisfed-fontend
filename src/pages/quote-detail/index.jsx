import MainContainer from 'components/layout/main-container';
import SidebarQuote from 'pages/quote/sidebar-quote';
import React from 'react';
import MainQuoteDetail from './main-quote-detail';

const QuoteDetail = () => {
	return <MainContainer main={<MainQuoteDetail />} right={<SidebarQuote />} />;
};

QuoteDetail.propTypes = {};

export default QuoteDetail;
