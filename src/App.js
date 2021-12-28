import Layout from 'components/layout';
import BookDetail from 'pages/book-detail';
import Category from 'pages/category';
import Group from 'pages/group';
import Home from 'pages/home';
import BookShelves from 'pages/shelves';
import { Routes, Route } from 'react-router-dom';
import 'scss/main.scss';

function App() {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<Home />} />
				<Route path='category' element={<Category />} />
				<Route path='shelves' element={<BookShelves />} />
				<Route path='group' element={<Group />} />
				<Route path='book/detail' element={<BookDetail/>}/>
			</Route>
		</Routes>
	);
}

export default App;
