import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useFetchCategoryDetail } from 'api/category.hook';
import classNames from 'classnames';
import { Heart } from 'components/svg';
import { NUMBER_OF_BOOKS } from 'constants';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'shared/back-button';
import BookThumbnail from 'shared/book-thumbnail';
import Button from 'shared/button';
import CategoryGroup from 'shared/category-group';
import FilterPane from 'shared/filter-pane';
import Post from 'shared/post';
import SearchField from 'shared/search-field';
import RouteLink from 'helpers/RouteLink';
import './main-category-detail.scss';
import SearchBook from './SearchBook';

const MainCategoryDetail = () => {
	const { id } = useParams();
	const { categoryInfo } = useFetchCategoryDetail(id);
	const { books = [] } = categoryInfo;
	const topBooks = books.slice(0, 10);
	const [bookList, setBookList] = useState(books.slice(0, 10));
	const [isLike, setIsLike] = useState(false);
	const [searchBooks, setSearchBooks] = useState([]);
	const navigate = useNavigate();
	const [inputSearch, setInputSearch] = useState('');

	useEffect(() => {
		if (books && books.length) {
			const data = books.slice(0, NUMBER_OF_BOOKS);
			setBookList(data);
		}
		if (!_.isEmpty(categoryInfo)) {
			navigate(RouteLink.categoryDetail(categoryInfo.id, categoryInfo.name));
		}
	}, [categoryInfo]);

	const handleLikeCategory = () => {
		setIsLike(!isLike);
	};

	const handleViewMore = () => {
		const currentLength = bookList.length;
		const total = books.length;
		if (currentLength < total) {
			const moreData = books.slice(currentLength, currentLength + NUMBER_OF_BOOKS);
			const data = bookList.concat(moreData);
			setBookList(data);
		}
	};

	const postList = Array.from(Array(5)).fill({
		id: 1,
		userAvatar: '/images/avatar.png',
		userName: 'Trần Văn Đức',
		bookImage: '',
		bookName: '',
		isLike: true,
		likeNumber: 15,
		commentNumber: 1,
		shareNumber: 3,
	});

	const filterBooks = name => {
		let results = [];
		if (books && books.length && name) {
			results = books.filter(book => book.name.toLowerCase().includes(name.trim().toLowerCase()));
			setSearchBooks(results);
		}
	};

	const debounceSearch = useCallback(_.debounce(filterBooks, 500), []);

	const handleSearch = e => {
		debounceSearch(e.target.value);
		setInputSearch(e.target.value);
	};

	return (
		<div className='main-category-detail'>
			<div className='main-category-detail__header'>
				<BackButton />
				<h4>{categoryInfo.name}</h4>
				<Button
					className={classNames('btn-like', { 'active': isLike })}
					isOutline={true}
					onClick={handleLikeCategory}
				>
					<span className='heart-icon'>
						<Heart />
					</span>
					<span>{isLike ? 'Đã yêu thích' : 'Yêu thích'}</span>
				</Button>
			</div>

			<p className='main-category-detail__intro'>{categoryInfo.description || 'Chưa cập nhật'}</p>

			<div className='main-category-detail__container'>
				<SearchField placeholder='Tìm kiếm sách trong chủ đề kinh doanh' handleChange={handleSearch} />
				{inputSearch && <SearchBook list={searchBooks} />}
				<CategoryGroup key={`category-group`} list={topBooks} title='Đọc nhiều nhất tuần này' />
				<div className='main-category-detail__allbook'>
					<h4>Tất cả sách chủ đề kinh doanh</h4>
					<div className='books'>
						{bookList.map((item, index) => (
							<BookThumbnail key={index} {...item} source={item.source} size='lg' />
						))}
					</div>
					<a className='view-all-link' onClick={handleViewMore}>
						Xem tất cả
					</a>
				</div>
			</div>

			<FilterPane title='Bài viết hay nhất'>
				<div className='main-category-detail__posts'>
					{postList && postList.length
						? postList.map((item, index) => (
								<Fragment key={`post-${index}`}>
									<Post className='post__container--category' postInformations={item} />
								</Fragment>
						  ))
						: null}
				</div>
			</FilterPane>
		</div>
	);
};

MainCategoryDetail.propTypes = {};

export default MainCategoryDetail;
