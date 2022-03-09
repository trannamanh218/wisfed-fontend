import { useFetchLibraries } from 'api/library.hook';
import MainContainer from 'components/layout/main-container';
import React from 'react';
import { useSelector } from 'react-redux';
import MainShelves from './main-shelves';
import SidebarShelves from './sidebar-shelves';

const BookShelves = () => {
	const { userInfo } = useSelector(state => state.auth);
	const filter = JSON.stringify([{ 'operator': 'eq', 'value': userInfo.id, 'property': 'createdBy' }]);
	useFetchLibraries(1, 10, filter);

	return <MainContainer main={<MainShelves />} right={<SidebarShelves />} />;
};

export default BookShelves;
