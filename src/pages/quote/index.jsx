import MainContainer from 'components/layout/main-container';
import { useEffect } from 'react';
import MainQuote from './main-quote';
import SidebarQuote from 'shared/sidebar-quote';

const Quote = () => {
	useEffect(() => {
		setTimeout(function () {
			window.scrollTo(0, 0);
		}, 22);
	});

	return <MainContainer main={<MainQuote />} right={<SidebarQuote />} />;
};

export default Quote;
