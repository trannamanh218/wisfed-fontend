import MainContainer from 'components/layout/main-container';
import MainAllQuotes from '../main-all-quote';
import SidebarQuote from 'shared/sidebar-quote';

const QuoteAll = () => {
	const hashtagList = [
		{ tag: { id: 1, name: '#Tiểu thuyết' } },
		{ tag: { id: 2, name: '#Hạnh phúc' } },
		{ tag: { id: 3, name: '#Đầu tư' } },
		{ tag: { id: 4, name: '#Hot Shearch' } },
		{ tag: { id: 4, name: '#Trending' } },
		{ tag: { id: 4, name: '#Hot' } },
		{ tag: { id: 4, name: '#One Piece' } },
	];

	return <MainContainer main={<MainAllQuotes />} right={<SidebarQuote listHashtags={hashtagList} />} />;
};

export default QuoteAll;
