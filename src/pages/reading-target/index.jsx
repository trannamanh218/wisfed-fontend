import { useFetchMyLibraries } from 'api/library.hook';
import MainContainer from 'components/layout/main-container';
import React from 'react';
import MainReadingTarget from './main-reading-target';
import SidebarReadingTarget from './sidebar-reading-target';

const ReadingTarget = () => {
	useFetchMyLibraries();

	return <MainContainer main={<MainReadingTarget />} right={<SidebarReadingTarget />} />;
};

ReadingTarget.propTypes = {};

export default ReadingTarget;
