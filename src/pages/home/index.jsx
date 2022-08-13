import { useEffect } from 'react';
import SubContainer from 'components/layout/sub-container';
import EventBar from 'pages/home/components/eventbar';
import NewFeed from 'pages/home/components/newfeed';
import Sidebar from 'pages/home/components/sidebar';

const Home = () => {
	useEffect(() => {
		window.scroll(0, 0);
	}, []);

	return <SubContainer left={<Sidebar />} main={<NewFeed />} right={<EventBar />} />;
};

export default Home;
