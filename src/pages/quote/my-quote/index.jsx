import MainContainer from 'components/layout/main-container';
import React from 'react';
import MainMyQuote from '../main-my-quote';
import SidebarMyQuote from '../sidebar-my-quote';

const MyQuote = () => {
	return <MainContainer main={<MainMyQuote />} right={<SidebarMyQuote />} />;
};

MyQuote.propTypes = {};

export default MyQuote;
