import Layout from 'components/layout';
import BookDetail from 'pages/book-detail';
import Category from 'pages/category';
import CategoryDetail from 'pages/category-detail';
import Group from 'pages/group';
import Home from 'pages/home';
import Quote from 'pages/quote';
import Review from 'pages/review';
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
				<Route path='book/detail' element={<BookDetail />} />
				<Route path='category/detail' element={<CategoryDetail />} />
				<Route path='review' element={<Review />} />
				<Route path='quote' element={<Quote />} />
			</Route>
		</Routes>
	);
}

export default App;
