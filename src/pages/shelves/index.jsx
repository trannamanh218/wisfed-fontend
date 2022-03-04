import { useFetchLibraries } from 'api/library.hook';
import MainContainer from 'components/layout/main-container';
import React from 'react';
import MainShelves from './main-shelves';
import SidebarShelves from './sidebar-shelves';

const BookShelves = () => {
	const { status } = useFetchLibraries();
	return <MainContainer main={<MainShelves />} right={<SidebarShelves />} />;
};

export default BookShelves;
