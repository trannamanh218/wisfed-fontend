import MainContainer from 'components/layout/main-container';
import React from 'react';
import MainProfile from './main-profile';
import SidebarProfile from './sidebar-profile';

const Profile = () => {
	return <MainContainer main={<MainProfile />} right={<SidebarProfile />} />;
};

export default Profile;
