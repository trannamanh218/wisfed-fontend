import MainContainer from 'components/layout/main-container';
import React, { useEffect } from 'react';
import MainMyQuote from '../main-my-quote';
import SidebarMyQuote from 'shared/sidebar-my-quote';

const MyQuote = () => {
	useEffect(() => {
		setTimeout(function () {
			window.scrollTo(0, 0);
		}, 22);
	});

	return <MainContainer main={<MainMyQuote />} right={<SidebarMyQuote />} />;
};

MyQuote.propTypes = {};

export default MyQuote;
