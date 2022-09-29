import { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { Heart } from 'components/svg';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'shared/back-button';
import BookThumbnail from 'shared/book-thumbnail';
import Button from 'shared/button';
import CategoryGroup from 'shared/category-group';
import FilterPane from 'shared/filter-pane';
import Post from 'shared/post';
import SearchField from 'shared/search-field';
import './main-category-detail.scss';
import SearchBook from './SearchBook';
import PropTypes from 'prop-types';
import { Modal, ModalBody } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { editUserInfoMyself } from 'reducers/redux-utils/user';
import { NotificationError } from 'helpers/Error';
import { getListBookByCategory, getPostsByCategory } from 'reducers/redux-utils/category';
import caretIcon from 'assets/images/caret.png';
import { getBookDetail } from 'reducers/redux-utils/book';
import RouteLink from 'helpers/RouteLink';
import Circle from 'shared/loading/circle';
import LoadingIndicator from 'shared/loading-indicator';
import { STATUS_LOADING } from 'constants/index';
import InfiniteScroll from 'react-infinite-scroll-component';
import FormCheckGroup from 'shared/form-check-group';
import { getFavoriteCategories } from 'reducers/redux-utils/category';
import { POST_TYPE } from 'constants/index';
import { getCategoryDetail } from 'reducers/redux-utils/category';

const MainCategoryDetail = () => {
	const { id } = useParams();
	const { userInfo } = useSelector(state => state.auth);
	const categoryInfoRedux = useSelector(state => state.category.categoryInfo);

	const [categoryInfo, setCategoryInfo] = useState({});
	const [bookList, setBookList] = useState([]);
	const [isLike, setIsLike] = useState(false);
	const [inputSearch, setInputSearch] = useState('');
	const [filter, setFilter] = useState('[]');
	const [hasMore, setHasMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [isFetchingBookList, setIsFetchingBookList] = useState(true);
	const [isFetchingBookDetail, setIsFetchingBookDetail] = useState(false);
	const [postsByCategory, setPostsByCategory] = useState([]);
	const [hasMorePost, setHasMorePost] = useState(true);
	const [sortValue, setSortValue] = useState('like');
	const [sortDirection, setSortDirection] = useState('DESC');
	const [sortValueTemp, setSortValueTemp] = useState('default');

	const callApiStart = useRef(16);
	const callApiPerPage = useRef(16);
	const callApiStartGetPosts = useRef(10);
	const callApiPerPageGetPosts = useRef(10);
	const favoriteCategories = useRef([]);
	const isLikeTemp = useRef(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const radioOptions = [
		{
			value: 'default',
			title: 'Bài viết nhiều like nhất',
		},
		{
			value: 'newest',
			title: 'Mới nhất',
		},
		{
			value: 'oldest',
			title: 'Cũ nhất',
		},
	];

	useEffect(() => {
		if (!_.isEmpty(categoryInfoRedux) && categoryInfoRedux.id === Number(id)) {
			setCategoryInfo(categoryInfoRedux);
		} else {
			getCategoryInfoFnc();
		}
		setFilter('[]');
		if (!_.isEmpty(categoryInfoRedux) && categoryInfoRedux.id === Number(id)) {
			setCategoryInfo(categoryInfoRedux);
		} else {
			getCategoryInfoFnc();
		}
		setFilter('[]');
		checkFavoriteCategoriesData();
	}, [id]);

	useEffect(() => {
		if (!_.isEmpty(categoryInfo)) {
			setIsLike(categoryInfo.isFavorite);
			isLikeTemp.current = categoryInfo.isFavorite;
		}
	}, [categoryInfo]);

	useEffect(() => {
		if (!_.isEmpty(categoryInfo)) {
			setIsLike(categoryInfo.isFavorite);
			isLikeTemp.current = categoryInfo.isFavorite;
		}
	}, [categoryInfo]);

	useEffect(() => {
		setHasMore(true);
		callApiStart.current = 16;
		getBooksByCategoryFirstTime();
	}, [filter, id]);

	useEffect(() => {
		setHasMorePost(true);
		callApiStartGetPosts.current = 10;
		handleGetPostsByCategoryFirstTime();
	}, [userInfo, id, sortDirection, sortValue]);

	const getCategoryInfoFnc = async () => {
		try {
			const res = await dispatch(getCategoryDetail(id)).unwrap();
			setCategoryInfo(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	const checkFavoriteCategoriesData = async () => {
		try {
			const res = await dispatch(getFavoriteCategories()).unwrap();
			favoriteCategories.current = res.rows;
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleLikeCategory = () => {
		if (_.isEmpty(userInfo)) {
			const customId = 'custom-id-MainCategoryDetail';
			toast.warn('Vui lòng đăng nhập để sử dụng tính năng này', { toastId: customId });
		} else {
			setIsLike(!isLike);
			handleCallLikeAndUnlikeCategoryApi(!isLike);
		}
	};

	const handleCallLikeAndUnlikeCategoryApi = useCallback(
		_.debounce(async isLikeData => {
			const categoryId = parseInt(id);
			if (isLikeData !== isLikeTemp.current) {
				isLikeTemp.current = isLikeData;
				let favoriteCategoryList = [];
				if (!isLikeData) {
					favoriteCategories.current.forEach(item => {
						if (item.categoryId !== categoryId) {
							favoriteCategoryList.push(item.categoryId);
						}
					});
				} else {
					favoriteCategoryList = favoriteCategories.current.map(item => item.categoryId);
					favoriteCategoryList.push(categoryId);
				}
				try {
					const params = {
						favoriteCategory: favoriteCategoryList,
					};
					await dispatch(editUserInfoMyself(params)).unwrap();
				} catch (err) {
					NotificationError(err);
				}
			}
		}, 1000),
		[favoriteCategories.current, userInfo]
	);

	const getBooksByCategoryFirstTime = async () => {
		setIsFetchingBookList(true);
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: filter,
			};
			const res = await dispatch(getListBookByCategory({ categoryId: id, params: params })).unwrap();
			setBookList(res);
			if (!res.length || res.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetchingBookList(false);
		}
	};

	const getBooksByCategory = async () => {
		setIsFetchingBookList(true);
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: filter,
			};
			const res = await dispatch(getListBookByCategory({ categoryId: id, params: params })).unwrap();
			if (res.length) {
				if (res.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setBookList(bookList.concat(res));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetchingBookList(false);
		}
	};

	const handleViewMore = () => {
		getBooksByCategory();
	};

	const updateInputSearch = value => {
		if (value) {
			const filterValue = [{ 'operator': 'search', 'value': value.trim(), 'property': 'name' }];
			setBookList([]);
			setFilter(JSON.stringify(filterValue));
			setHasMore(true);
		} else {
			setFilter('[]');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const handleSortPost = () => {
		setShowModal(true);
	};

	const handleViewBookDetail = async data => {
		setIsFetchingBookDetail(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setIsFetchingBookDetail(false);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleGetPostsByCategoryFirstTime = async () => {
		try {
			const params = {
				start: 0,
				limit: callApiPerPageGetPosts.current,
				sort: JSON.stringify([{ direction: sortDirection, property: sortValue }]),
			};
			const res = await dispatch(getPostsByCategory({ categoryId: id, params })).unwrap();
			setPostsByCategory(res);
			if (!res.length || res.length < callApiPerPageGetPosts.current) {
				setHasMorePost(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleGetPostsByCategory = async () => {
		try {
			const params = {
				start: callApiStartGetPosts.current,
				limit: callApiPerPageGetPosts.current,
				sort: JSON.stringify([{ direction: sortDirection, property: sortValue }]),
			};
			const res = await dispatch(getPostsByCategory({ categoryId: id, params })).unwrap();
			if (res.length) {
				if (res.length < callApiPerPageGetPosts.current) {
					setHasMorePost(false);
				} else {
					callApiStartGetPosts.current += callApiPerPageGetPosts.current;
				}
				setPostsByCategory(postsByCategory.concat(res));
			} else {
				setHasMorePost(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleChange = data => {
		setSortValueTemp(data);
	};

	const handleSortQuotes = () => {
		if (sortValueTemp === 'default') {
			setSortValue('like');
			setSortDirection('DESC');
		} else if (sortValueTemp === 'newest') {
			setSortValue('createdAt');
			setSortDirection('DESC');
		} else if (sortValueTemp === 'oldest') {
			setSortValue('createdAt');
			setSortDirection('ASC');
		}
		setShowModal(false);
	};

	const handleViewTopBooksOfWeek = () => {
		localStorage.setItem('category', JSON.stringify({ value: categoryInfo.id, title: categoryInfo.name }));
		navigate('/top100');
	};

	return (
		<div className='main-category-detail'>
			<Circle loading={isFetchingBookDetail || status === STATUS_LOADING} />
			{status !== STATUS_LOADING && (
				<>
					{_.isEmpty(categoryInfo) ? (
						<>
							<div className='main-category-detail__header'>
								<BackButton destination='/category' />
							</div>
							<p className='main-category-detail__intro'>Không tìm thấy chủ đề</p>
						</>
					) : (
						<>
							<div className='main-category-detail__header'>
								<BackButton destination='/category' />
								<h4>{categoryInfo.name}</h4>
								{isLike !== null && (
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
								)}
							</div>

							{categoryInfo.description && (
								<p className='main-category-detail__intro'>{categoryInfo.description}</p>
							)}

							<div className='main-category-detail__container'>
								<SearchField
									placeholder={`Tìm kiếm sách trong chủ đề ${categoryInfo.name}`}
									handleChange={handleSearch}
									value={inputSearch}
								/>

								<>
									{filter !== '[]' ? (
										<SearchBook
											list={bookList}
											handleViewBookDetail={handleViewBookDetail}
											inputSearch={inputSearch}
										/>
									) : (
										<>
											{!!categoryInfo?.topBookReads.length && (
												<CategoryGroup
													key={`category-group`}
													list={categoryInfo.topBookReads}
													title='Đọc nhiều nhất tuần này'
													handleViewBookDetail={handleViewBookDetail}
													handleViewCategoryDetail={handleViewTopBooksOfWeek}
													inCategoryDetail={true}
												/>
											)}

											<div className='main-category-detail__allbook'>
												<h4>
													{`Tất cả sách chủ đề "${
														categoryInfo.name ? categoryInfo.name.toLowerCase() : ''
													}"`}
												</h4>
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
											</div>
										</>
									)}
									{isFetchingBookList && <LoadingIndicator />}
									{hasMore && (
										<button className='get-more-books-btn' onClick={handleViewMore}>
											<img src={caretIcon} alt='caret-icon' />
											<span>Xem thêm</span>
										</button>
									)}
								</>
							</div>

							{!!postsByCategory.length && (
								<FilterPane
									title='Bài viết hay nhất'
									handleSortFilter={handleSortPost}
									hasHeaderLine={true}
								>
									<div className='main-category-detail__posts'>
										<InfiniteScroll
											dataLength={postsByCategory.length}
											next={handleGetPostsByCategory}
											hasMore={hasMorePost}
											loader={<LoadingIndicator />}
										>
											{postsByCategory.map(item => (
												<Fragment key={item.id}>
													<Post
														className='post__container--category'
														postInformations={item}
														type={POST_TYPE}
													/>
												</Fragment>
											))}
										</InfiniteScroll>
									</div>
									<Modal
										show={showModal}
										onHide={() => setShowModal(false)}
										className='main-category-detail__modal'
										keyboard={false}
										centered
									>
										<ModalBody className='main-category-detail__modal__content'>
											<div className='main-category-detail__modal__group'>
												<h6 className='main-category-detail__modal__title'>Mặc định</h6>
												<FormCheckGroup
													data={radioOptions[0]}
													name='custom'
													type='radio'
													defaultValue='default'
													handleChange={handleChange}
													checked={radioOptions[0].value === sortValueTemp}
												/>
												<h6
													style={{ marginTop: '24px' }}
													className='main-category-detail__modal__title'
												>
													Theo thời gian tạo
												</h6>
												<FormCheckGroup
													data={radioOptions[1]}
													name='custom'
													type='radio'
													defaultValue='default'
													handleChange={handleChange}
													checked={radioOptions[1].value === sortValueTemp}
												/>
												<FormCheckGroup
													data={radioOptions[2]}
													name='custom'
													type='radio'
													defaultValue='default'
													handleChange={handleChange}
													checked={radioOptions[2].value === sortValueTemp}
												/>
											</div>
											<Button
												className='main-category-detail__modal__btn'
												onClick={handleSortQuotes}
											>
												Xác nhận
											</Button>
										</ModalBody>
									</Modal>
								</FilterPane>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};

MainCategoryDetail.propTypes = {
	handleViewBookDetail: PropTypes.func,
};

export default MainCategoryDetail;
