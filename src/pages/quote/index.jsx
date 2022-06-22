import MainContainer from 'components/layout/main-container';
import { useEffect } from 'react';
import MainQuote from './main-quote';
import SidebarQuote from 'shared/sidebar-quote';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Quote = () => {
	const hashtagList = [
		{ tag: { id: 1, name: '#Tiểu thuyết' } },
		{ tag: { id: 2, name: '#Hạnh phúc' } },
		{ tag: { id: 3, name: '#Đầu tư' } },
		{ tag: { id: 4, name: '#Hot Shearch' } },
		{ tag: { id: 4, name: '#Trending' } },
		{ tag: { id: 4, name: '#Hot' } },
		{ tag: { id: 4, name: '#One Piece' } },
	];

	const { userId } = useParams();
	const userInfo = useSelector(state => state.auth.userInfo);

	useEffect(() => {
		setTimeout(function () {
			window.scrollTo(0, 0);
		}, 22);
	});

	return (
		<MainContainer
			main={<MainQuote />}
			right={<SidebarQuote listHashtags={hashtagList} inMyQuote={userInfo.id === userId} hasCountQuotes={true} />}
		/>
	);
};

export default Quote;
