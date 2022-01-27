import React from 'react';
import CategoryGroup from 'shared/category-group';
import SearchField from 'shared/search-field';
import './main-category.scss';

const MainCategory = () => {
	const bookList = new Array(10).fill({ source: '/images/book1.jpg', name: 'Design pattern' });

	return (
		<div className='main-category'>
			<h4>Tất cả chủ đề</h4>
			<div className='main-category__container'>
				<SearchField placeholder='Tìm kiếm chủ đề' />
				{[...Array(5)].map((_, index) => (
					<CategoryGroup key={`category-group-${index}`} list={bookList} title={`Tiểu thuyết ${index}`} />
				))}
			</div>
		</div>
	);
};

MainCategory.propTypes = {};

export default MainCategory;
