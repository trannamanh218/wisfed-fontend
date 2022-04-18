import MainContainer from 'components/layout/main-container';
import SidebarMyQuote from 'shared/sidebar-quote';
import React from 'react';
import MainQuoteDetail from './main-quote-detail';

const QuoteDetail = () => {
	return <MainContainer main={<MainQuoteDetail />} right={<SidebarMyQuote />} />;
};

export default QuoteDetail;
