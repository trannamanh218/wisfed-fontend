import MainContainer from 'components/layout/main-container';
import React from 'react';
import MainQuote from './main-quote';
import SidebarQuote from './sidebar-quote';

const Quote = () => {
	return <MainContainer main={<MainQuote />} right={<SidebarQuote />} />;
};

Quote.propTypes = {};

export default Quote;
