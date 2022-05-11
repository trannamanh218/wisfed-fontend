import React from 'react';
import MainContainer from 'components/layout/main-container';
import MainReadingSummary from './main-reading-summary';
import SidebarReadingSummary from './sidebar-reading-summary';
import { useFetchMyLibraries } from 'api/library.hook';

const ReadingSummary = () => {
	useFetchMyLibraries();

	return <MainContainer main={<MainReadingSummary />} right={<SidebarReadingSummary />} />;
};

export default ReadingSummary;
