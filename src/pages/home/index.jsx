import React from 'react';
import SubContainer from 'components/layout/sub-container';
import EventBar from 'pages/home/components/eventbar';
import NewFeed from 'pages/home/components/newfeed';
import Sidebar from 'pages/home/components/sidebar';

const Home = () => {
	return <SubContainer left={<Sidebar />} main={<NewFeed />} right={<EventBar />} />;
};

export default Home;
