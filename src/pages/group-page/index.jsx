import MainContainer from 'components/layout/main-container';
import React from 'react';
import MainGroup from './MainGroup';

const Group = () => {
	const SidebarGroup = () => <div>This is sidebar group page</div>;
	return <MainContainer main={<MainGroup />} right={<SidebarGroup />} />;
};

export default Group;
