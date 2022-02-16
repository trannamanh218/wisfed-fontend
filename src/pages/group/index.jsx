import MainContainer from 'components/layout/main-container';
import React from 'react';

const Group = () => {
	const MainGroup = () => <div>This is main group page</div>;
	const SidebarGroup = () => <div>This is sidebar group page</div>;
	return <MainContainer main={<MainGroup />} right={<SidebarGroup />} />;
};

export default Group;
