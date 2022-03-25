import React, { Fragment, useCallback, useEffect, useState } from 'react';
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
import { useFetchBooks } from 'api/book.hooks';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'react-bootstrap';
import MultipleCheckbox from 'shared/multiple-checkbox';
import MultipleRadio from 'shared/multiple-radio';
import { useModal } from 'shared/hooks';

const MainCategoryDetail = ({ handleViewBookDetail }) => {
	const { id } = useParams();
	const { categoryInfo } = useFetchCategoryDetail(id);
	const books = categoryInfo?.books || [];
	const topBooks = books.slice(0, 10);
	const [bookList, setBookList] = useState(books.slice(0, 10));
	const [isLike, setIsLike] = useState(false);
	const [inputSearch, setInputSearch] = useState('');
	const [filter, setFilter] = useState('[]');
	const { modalOpen, setModalOpen, toggleModal } = useModal(false);
	const { books: searchResults } = useFetchBooks(1, 10, filter);
	const navigate = useNavigate();

	const checkOptions = [
		{
			value: 'likeMost',
			title: 'Review nhiều like nhất',
		},
	];
	const starOptions = new Array(5).fill({}).map((_, index) => ({ value: index + 1, title: `${index + 1} sao` }));
	const publishOptiosn = [
		{
			value: 'newest',
			title: 'Mới nhất',
		},
		{
			value: 'oldest',
			title: 'Cũ nhất',
		},
	];
	const reviewOptions = [
		{ value: 'followMost', title: 'Có nhiều Follow nhất' },
		{ value: 'reviewMost', title: 'Có nhiều Review nhất' },
	];

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

	const updateInputSearch = value => {
		if (value) {
			const filterValue = [{ 'operator': 'eq', 'value': id, 'property': 'categoryId' }];
			filterValue.push({ 'operator': 'search', 'value': value.trim(), 'property': 'name' });
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	if (_.isEmpty(categoryInfo)) {
		return (
			<div className='main-category-detail'>
				<div className='main-category-detail__header'>
					<BackButton />
				</div>
				<p className='main-category-detail__intro'>Không tìm thấy chủ đề</p>
			</div>
		);
	}

	const handleFilter = () => {
		setModalOpen(true);
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
				<SearchField
					placeholder='Tìm kiếm sách trong chủ đề kinh doanh'
					handleChange={handleSearch}
					value={inputSearch}
				/>
				{inputSearch && <SearchBook list={searchResults} handleViewBookDetail={handleViewBookDetail} />}
				<CategoryGroup
					key={`category-group`}
					list={topBooks}
					title='Đọc nhiều nhất tuần này'
					handleViewBookDetail={handleViewBookDetail}
				/>
				<div className='main-category-detail__allbook'>
					<h4>Tất cả sách chủ đề {categoryInfo.name ? categoryInfo.name.toLowerCase() : ''}</h4>
					<div className='books'>
						{bookList.map((item, index) => (
							<BookThumbnail
								key={index}
								{...item}
								source={item.source}
								size='lg'
								data={item}
								handleClick={handleViewBookDetail}
							/>
						))}
					</div>
					<a className='view-all-link' onClick={handleViewMore}>
						Xem tất cả
					</a>
				</div>
			</div>

			<FilterPane title='Bài viết hay nhất' onFilter={handleFilter}>
				<div className='main-category-detail__posts'>
					{postList && postList.length
						? postList.map((item, index) => (
								<Fragment key={`post-${index}`}>
									<Post className='post__container--category' postInformations={item} />
								</Fragment>
						  ))
						: null}
				</div>
				<Modal
					show={modalOpen}
					onHide={toggleModal}
					className='main-category-detail__modal'
					keyboard={false}
					centered
				>
					<ModalBody>
						<div className='main-category-detail__modal__option__group'>
							<h4>Mặc định</h4>
							<MultipleRadio list={checkOptions} name='default' value='likeMost' />
						</div>
						{/* <div className='main-category-detail__modal__option__group'>
							<h4>Theo số sao</h4>
							<MultipleCheckbox list={starOptions} name='star' value='1' />
						</div> */}
						<div className='main-category-detail__modal__option__group'>
							<h4>Theo thời gian phát hành</h4>
							<MultipleRadio list={publishOptiosn} name='pulish-time' value='' />
						</div>
						{/* <div className='main-category-detail__modal__option__group'>
							<h4>Theo người review</h4>
							<MultipleCheckbox list={reviewOptions} name='review' value='' />
						</div> */}
						<Button className='btn-confirm'>Xác nhận</Button>
					</ModalBody>
				</Modal>
			</FilterPane>
		</div>
	);
};

MainCategoryDetail.propTypes = {
	handleViewBookDetail: PropTypes.func,
};

export default MainCategoryDetail;
