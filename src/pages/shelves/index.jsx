import { useFetchMyLibraries } from 'api/library.hook';
import MainContainer from 'components/layout/main-container';
import React, { useState } from 'react';
import MainShelves from './main-shelves';
import SidebarShelves from './sidebar-shelves';

const BookShelves = () => {
	const [isUpdate, setIsUpdate] = useState(false);
	useFetchMyLibraries(isUpdate);

	const handleRemoveBook = () => {
		setIsUpdate(!isUpdate);
	};

	return (
		<MainContainer
			main={<MainShelves handleRemoveBook={handleRemoveBook} isUpdate={isUpdate} />}
			right={<SidebarShelves isUpdate={isUpdate} />}
		/>
	);
};

export default BookShelves;
